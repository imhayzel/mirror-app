import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import Anthropic from '@anthropic-ai/sdk'
import { SupabaseClient } from '@supabase/supabase-js'
import { createServerSupabaseClient } from '@/lib/supabase-server'

const anthropic = new Anthropic()

async function isDailyLimitReached(userId: string, db: SupabaseClient): Promise<boolean> {
  const today = new Date().toISOString().split('T')[0]
  const { count } = await db
    .from('ai_usage')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', today)
  return (count ?? 0) >= 5
}

async function logUsage(userId: string, feature: string, db: SupabaseClient) {
  await db.from('ai_usage').insert({ user_id: userId, feature })
}

const IMAGE_EXT_RE = /\.(jpe?g|png|webp|gif)(\?.*)?$/i
const VALID_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

async function extractProductImageUrl(pageUrl: string): Promise<string | null> {
  try {
    const res = await fetch(pageUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
      signal: AbortSignal.timeout(8000),
    })
    const html = await res.text()
    const ogMatch =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)
    if (ogMatch?.[1]) return ogMatch[1]
    const imgMatch = html.match(/<img[^>]+src=["'](https[^"']+\.(?:jpe?g|png|webp))["']/i)
    return imgMatch?.[1] ?? null
  } catch {
    return null
  }
}

async function fetchImageAsBase64(url: string): Promise<{ base64: string; mimeType: string; resolvedUrl: string } | null> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) return null
    const buffer = await res.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')
    const contentType = res.headers.get('content-type') || ''
    const mimeType = VALID_MIME.has(contentType.split(';')[0].trim())
      ? contentType.split(';')[0].trim()
      : 'image/jpeg'
    return { base64, mimeType, resolvedUrl: url }
  } catch {
    return null
  }
}

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = await createServerSupabaseClient()

  if (await isDailyLimitReached(userId, db)) {
    return NextResponse.json({ error: 'daily_limit_reached' }, { status: 429 })
  }

  const { imageBase64, mimeType, imageUrl } = await req.json()
  if (!imageBase64 && !imageUrl) {
    return NextResponse.json({ error: 'Provide imageBase64 or imageUrl' }, { status: 400 })
  }

  let resolvedBase64: string
  let resolvedMimeType: string
  let resolvedImageUrl: string | null = null

  if (imageBase64) {
    resolvedBase64 = imageBase64 as string
    resolvedMimeType = (mimeType as string) || 'image/jpeg'
  } else {
    // Determine if it's a direct image URL or a product page
    const isDirectImage = IMAGE_EXT_RE.test(imageUrl as string)
    let imageToFetch = imageUrl as string

    if (!isDirectImage) {
      // Extract og:image from the product page
      const extracted = await extractProductImageUrl(imageUrl as string)
      if (!extracted) {
        return NextResponse.json(
          { error: 'Could not extract an image from that URL. Try pasting a direct image URL instead.' },
          { status: 400 }
        )
      }
      imageToFetch = extracted
    }

    // Fetch and convert to base64 (avoids Anthropic URL download failures)
    const fetched = await fetchImageAsBase64(imageToFetch)
    if (!fetched) {
      return NextResponse.json({ error: 'Could not load the image. Try a different URL.' }, { status: 400 })
    }
    resolvedBase64 = fetched.base64
    resolvedMimeType = fetched.mimeType
    resolvedImageUrl = fetched.resolvedUrl
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: resolvedMimeType as Anthropic.Base64ImageSource['media_type'],
              data: resolvedBase64,
            },
          },
          {
            type: 'text',
            text: `You are a fashion expert. Look at this clothing item and extract:
1. name: short descriptive name (2-4 words, e.g. "Camel wool coat")
2. type: choose ONE from the definitions below — be strict:
   - TOP: t-shirts, shirts, blouses, tank tops, lightweight base layer sweaters (worn under a jacket/coat)
   - OUTERWEAR: ALL jackets, coats, hoodies, zip-up hoodies, blazers, cardigans, bombers, parkas, trench coats, windbreakers — anything worn as the outer layer. ZIP HOODIES ARE ALWAYS OUTERWEAR.
   - BOTTOM: trousers, jeans, shorts, skirts, leggings, tights
   - SHOES: all footwear — sneakers, boots, heels, sandals, loafers
   - ACCESSORY: bags, scarves, hats, jewellery, belts, sunglasses
3. color: describe the color specifically:
   - Solid: use the precise shade — e.g. "Forest Green" not "Green", "Burgundy" not "Red", "Cobalt Blue" not "Blue", "Camel" not "Brown", "Ecru" not "White", "Slate" not "Grey", "Mustard" not "Yellow"
   - Striped: "Cream Stripe", "Navy Stripe", "Black and White Stripe"
   - Checked/plaid: "Navy Check", "Camel Check", "Green Plaid"
   - Multi-color or print: name the two dominant colors — e.g. "Black and White", "Red and Navy"

Respond with ONLY valid JSON, no other text: {"name": "...", "type": "...", "color": "..."}`
          }
        ]
      }]
    })

    const text = response.content[0].type === 'text' ? response.content[0].text.trim() : ''
    const match = text.match(/\{[\s\S]*?\}/)
    if (!match) return NextResponse.json({ error: 'Failed to parse response' }, { status: 500 })

    const data = JSON.parse(match[0])
    data.type = (data.type as string).toLowerCase()
    if (resolvedImageUrl) data.image_url = resolvedImageUrl

    await logUsage(userId, 'categorize', db)
    return NextResponse.json(data)
  } catch (err) {
    console.error('[categorize] Anthropic error:', err)
    return NextResponse.json({ error: 'AI analysis failed' }, { status: 500 })
  }
}
