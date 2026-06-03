import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabase } from '@/lib/supabase'

const anthropic = new Anthropic()

async function isDailyLimitReached(userId: string): Promise<boolean> {
  const today = new Date().toISOString().split('T')[0]
  const { count } = await supabase
    .from('ai_usage')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', today)
  return (count ?? 0) >= 5
}

async function logUsage(userId: string, feature: string) {
  await supabase.from('ai_usage').insert({ user_id: userId, feature })
}

async function extractImageUrl(productUrl: string): Promise<string | null> {
  if (/\.(jpe?g|png|webp|gif)(\?.*)?$/i.test(productUrl)) return productUrl
  try {
    const res = await fetch(productUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Mirror/1.0)' },
      signal: AbortSignal.timeout(5000),
    })
    const html = await res.text()
    const match =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)
    return match ? match[1] : null
  } catch {
    return null
  }
}

type WardrobeRow = { name: string; type: string; color: string | null }

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (await isDailyLimitReached(userId)) {
    return NextResponse.json({ error: 'daily_limit_reached' }, { status: 429 })
  }

  const { imageBase64, mimeType, productUrl } = await req.json()
  if (!imageBase64 && !productUrl) {
    return NextResponse.json({ error: 'Provide imageBase64 or productUrl' }, { status: 400 })
  }

  const { data: items } = await supabase
    .from('wardrobe_items')
    .select('name, type, color')
    .eq('user_id', userId)
    .limit(30)

  const wardrobeContext =
    items && items.length > 0
      ? `User's existing wardrobe:\n${(items as WardrobeRow[]).map(i => `- ${i.name} | ${i.type.toUpperCase()} | ${i.color || 'unknown'}`).join('\n')}`
      : 'User has no wardrobe items yet.'

  let imageSource: Anthropic.Base64ImageSource | Anthropic.URLImageSource

  if (imageBase64) {
    imageSource = {
      type: 'base64',
      media_type: ((mimeType || 'image/jpeg') as Anthropic.Base64ImageSource['media_type']),
      data: imageBase64 as string,
    }
  } else {
    const imageUrl = await extractImageUrl(productUrl as string)
    if (!imageUrl) {
      return NextResponse.json({ error: 'Could not extract image from that URL. Try pasting a direct image URL.' }, { status: 400 })
    }
    imageSource = { type: 'url', url: imageUrl }
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: imageSource },
          {
            type: 'text',
            text: `${wardrobeContext}\n\nLook at the item in this image. Should the user BUY or SKIP it?\n\nConsider: does it complement their wardrobe, fill a real gap, or just duplicate what they already own?\n\nRespond with ONLY valid JSON, no other text:\n{"verdict": "BUY", "reasoning": "2-3 sentences, fashion editor voice, no exclamation marks", "pairs_with": ["existing item name 1", "existing item name 2"]}\nor\n{"verdict": "SKIP", "reasoning": "...", "pairs_with": []}`
          }
        ]
      }]
    })

    const text = response.content[0].type === 'text' ? response.content[0].text.trim() : ''
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) return NextResponse.json({ error: 'Failed to parse response' }, { status: 500 })

    const data = JSON.parse(match[0])
    await logUsage(userId, 'checker')

    return NextResponse.json(data)
  } catch (err) {
    console.error('[checker]', err)
    return NextResponse.json({ error: 'AI analysis failed' }, { status: 500 })
  }
}
