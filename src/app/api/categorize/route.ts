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

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

// Extracts product image URL and color name from a product page.
// Tries 5 methods in order and logs which succeeded.
async function extractProductPageData(pageUrl: string): Promise<{
  imageUrl: string | null
  colorName: string | null
  useDirectUrl: boolean
}> {
  try {
    const res = await fetch(pageUrl, {
      headers: { 'User-Agent': UA },
      signal: AbortSignal.timeout(10000),
    })
    const html = await res.text()

    let imageUrl: string | null = null
    let method = 'none'

    // 1. og:image
    const ogMatch =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)
    if (ogMatch?.[1]) {
      imageUrl = ogMatch[1]
      method = 'og:image'
    }

    // 2. twitter:image
    if (!imageUrl) {
      const twMatch =
        html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i) ||
        html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i) ||
        html.match(/<meta[^>]+property=["']twitter:image["'][^>]+content=["']([^"']+)["']/i)
      if (twMatch?.[1]) {
        imageUrl = twMatch[1]
        method = 'twitter:image'
      }
    }

    // 3. <img> with cdn/product/media/image in the URL path
    if (!imageUrl) {
      const imgTags = [...html.matchAll(/<img[^>]+src=["'](https?[^"']+)["']/gi)]
      const cdnImg = imgTags.find(m =>
        /\/(cdn|product|products|media|images?)\//i.test(m[1]) &&
        /\.(jpe?g|png|webp)/i.test(m[1])
      )
      if (cdnImg) {
        imageUrl = cdnImg[1]
        method = 'img-cdn'
      }
    }

    // 4. Any https image in img tags
    if (!imageUrl) {
      const anyImg = html.match(/<img[^>]+src=["'](https[^"']+\.(?:jpe?g|png|webp))["']/i)
      if (anyImg?.[1]) {
        imageUrl = anyImg[1]
        method = 'img-any'
      }
    }

    // 5. Fall back: pass the page URL directly to Claude
    const useDirectUrl = !imageUrl
    if (useDirectUrl) {
      method = 'direct-url-fallback'
    }

    // Extract color name from the product page HTML
    let colorName: string | null = null
    const colorPatterns = [
      // JSON-LD / structured data: "color": "Hazelnut"
      /"color"\s*:\s*"([^"]{2,40})"/i,
      // Explicit label: Color: Hazelnut or Colour: Slate Blue
      /(?:^|\s)colou?r\s*[:\-–]\s*([A-Za-z][A-Za-z\s/]{1,30}?)(?:\s*[<\n,|])/im,
      // data-color attribute
      /data-colou?r=["']([^"']{2,40})["']/i,
      // Common React/JSON props: "selectedColor":"Hazelnut"
      /"selectedColou?r"\s*:\s*"([^"]{2,40})"/i,
      // Class-based: <span class="color-name">Hazelnut</span>
      /class=["'][^"']*colou?r[-_](?:name|value|label)[^"']*["'][^>]*>\s*([A-Za-z][^<]{1,30}?)\s*</i,
    ]
    for (const pattern of colorPatterns) {
      const match = html.match(pattern)
      if (match?.[1]) {
        const candidate = match[1].trim()
        // Reject CSS/HTML values and very generic strings
        if (
          candidate.length >= 2 &&
          candidate.length <= 40 &&
          !/^(#|rgb|rgba|hsl|transparent|inherit|none|block|flex|auto|true|false|\d)/i.test(candidate) &&
          !/\bselect\b|\bchoose\b|\bcolor\b|\bcolour\b/i.test(candidate)
        ) {
          colorName = candidate
          break
        }
      }
    }

    console.log(`[categorize] image method: ${method} | page color: ${colorName ?? 'none'}`)
    return { imageUrl, colorName, useDirectUrl }
  } catch (err) {
    console.error('[categorize] page extraction error:', err)
    return { imageUrl: null, colorName: null, useDirectUrl: true }
  }
}

async function fetchImageAsBase64(url: string): Promise<{ base64: string; mimeType: string; resolvedUrl: string } | null> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': UA },
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

function buildPrompt(pageColorName: string | null): string {
  const colorInstruction = pageColorName
    ? `3. color: The product page lists the color as "${pageColorName}". Use this exact name for solid-colored items. If the item is patterned, striped, checked, or multi-colored, use visual analysis instead and describe the pattern (e.g. "Navy Stripe", "Black and White Check").`
    : `3. color: Determine the color by VISUALLY ANALYZING the image only. Do not read product name, text overlays, or watermarks.
   - Greys: Ash Grey, Light Grey, Charcoal, Stone, Slate, Off-White
   - Whites/creams: White, Ivory, Ecru, Cream
   - Browns/neutrals: Chocolate Brown, Dark Brown, Camel, Tan, Hazel, Beige, Sand
   - Blacks: Black, Faded Black
   - Blues: Navy, Cobalt Blue, Sky Blue, Denim Blue, Royal Blue
   - Greens: Sage Green, Forest Green, Olive, Khaki, Mint
   - Reds/pinks: Burgundy, Wine, Red, Coral, Blush, Pink
   - Yellows/oranges: Mustard, Yellow, Ochre, Orange, Rust
   - Purples: Lavender, Lilac, Purple, Plum
   - Striped: "Cream Stripe", "Navy Stripe", "Black and White Stripe"
   - Checked/plaid: "Navy Check", "Camel Check", "Green Plaid"
   - Multi-color or print: name the two dominant colors — e.g. "Black and White", "Red and Navy"`

  return `You are a fashion expert. Look at this clothing item and extract:
1. name: short descriptive name (2-4 words, e.g. "Camel wool coat")
2. type: choose ONE — be strict:
   - top: t-shirts, shirts, blouses, tank tops, lightweight base layer sweaters
   - outerwear: ALL jackets, coats, hoodies, zip-up hoodies, blazers, cardigans, bombers, parkas, trench coats, windbreakers. ZIP HOODIES ARE ALWAYS OUTERWEAR.
   - bottom: trousers, jeans, shorts, skirts, leggings, tights
   - shoes: all footwear
   - accessory: bags, scarves, hats, jewellery, belts, sunglasses
${colorInstruction}
4. descriptors: choose exactly 3 from this list that best describe the item's style:
   OVERSIZED, RELAXED, SLIM, TAILORED, CROPPED, FEMININE, MASCULINE, SPORTY, ELEGANT, MINIMAL, CASUAL, FORMAL, WEEKEND, STREETWEAR, CLASSIC
   Return as a JSON array.

Respond with ONLY valid JSON, no other text: {"name": "...", "type": "...", "color": "...", "descriptors": ["...", "...", "..."]}`
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

  let resolvedBase64: string | null = null
  let resolvedMimeType = 'image/jpeg'
  let resolvedImageUrl: string | null = null
  let useDirectUrl = false
  let pageColorName: string | null = null

  if (imageBase64) {
    resolvedBase64 = imageBase64 as string
    resolvedMimeType = (mimeType as string) || 'image/jpeg'
  } else {
    const isDirectImage = IMAGE_EXT_RE.test(imageUrl as string)

    if (isDirectImage) {
      const fetched = await fetchImageAsBase64(imageUrl as string)
      if (!fetched) {
        return NextResponse.json({ error: 'Could not load the image. Try a different URL.' }, { status: 400 })
      }
      resolvedBase64 = fetched.base64
      resolvedMimeType = fetched.mimeType
      resolvedImageUrl = fetched.resolvedUrl
    } else {
      // Product page — extract image + color
      const extracted = await extractProductPageData(imageUrl as string)
      pageColorName = extracted.colorName

      if (extracted.useDirectUrl) {
        // All extraction methods failed — pass URL directly to Claude
        resolvedImageUrl = imageUrl as string
        useDirectUrl = true
      } else {
        const fetched = await fetchImageAsBase64(extracted.imageUrl!)
        if (!fetched) {
          // Extracted URL failed to load — fall back to direct
          resolvedImageUrl = imageUrl as string
          useDirectUrl = true
        } else {
          resolvedBase64 = fetched.base64
          resolvedMimeType = fetched.mimeType
          resolvedImageUrl = fetched.resolvedUrl
        }
      }
    }
  }

  try {
    const imageSource = useDirectUrl
      ? ({ type: 'url', url: resolvedImageUrl! } as Anthropic.URLImageSource)
      : ({
          type: 'base64',
          media_type: resolvedMimeType as Anthropic.Base64ImageSource['media_type'],
          data: resolvedBase64!,
        } as Anthropic.Base64ImageSource)

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: imageSource },
          { type: 'text', text: buildPrompt(pageColorName) },
        ],
      }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text.trim() : ''
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) return NextResponse.json({ error: 'Failed to parse response' }, { status: 500 })

    const data = JSON.parse(match[0])
    data.type = (data.type as string).toLowerCase()
    if (!Array.isArray(data.descriptors)) data.descriptors = []
    if (resolvedImageUrl && !useDirectUrl) data.image_url = resolvedImageUrl

    await logUsage(userId, 'categorize', db)
    return NextResponse.json(data)
  } catch (err) {
    console.error('[categorize] Anthropic error:', err)
    return NextResponse.json({ error: 'AI analysis failed' }, { status: 500 })
  }
}
