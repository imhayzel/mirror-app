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

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (await isDailyLimitReached(userId)) {
    return NextResponse.json({ error: 'daily_limit_reached' }, { status: 429 })
  }

  const { imageBase64, mimeType, imageUrl } = await req.json()
  if (!imageBase64 && !imageUrl) {
    return NextResponse.json({ error: 'Provide imageBase64 or imageUrl' }, { status: 400 })
  }

  const imageSource = imageBase64
    ? { type: 'base64' as const, media_type: ((mimeType || 'image/jpeg') as Anthropic.Base64ImageSource['media_type']), data: imageBase64 as string }
    : { type: 'url' as const, url: imageUrl as string }

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
            text: 'You are a fashion expert. Look at this clothing item and extract:\n1. name: short descriptive name (2-4 words, e.g. "Camel wool coat")\n2. type: one of TOP, BOTTOM, OUTERWEAR, SHOES, ACCESSORY\n3. color: primary color (e.g. "Camel", "Navy", "Ivory")\n\nRespond with ONLY valid JSON, no other text: {"name": "...", "type": "...", "color": "..."}'
          }
        ]
      }]
    })

    const text = response.content[0].type === 'text' ? response.content[0].text.trim() : ''
    const match = text.match(/\{[\s\S]*?\}/)
    if (!match) return NextResponse.json({ error: 'Failed to parse response' }, { status: 500 })

    const data = JSON.parse(match[0])
    data.type = (data.type as string).toLowerCase()

    await logUsage(userId, 'categorize')
    return NextResponse.json(data)
  } catch (err) {
    console.error('[categorize]', err)
    return NextResponse.json({ error: 'AI analysis failed' }, { status: 500 })
  }
}
