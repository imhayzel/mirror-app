import { NextResponse } from 'next/server'
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

type WardrobeRow = { name: string; type: string; color: string | null; descriptors: string[] | null }

export async function POST() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: items } = await supabase
    .from('wardrobe_items')
    .select('name, type, color, descriptors')
    .eq('user_id', userId)

  if (!items || items.length < 5) {
    return NextResponse.json(
      { error: 'not_enough_items', required: 5, current: items?.length ?? 0 },
      { status: 400 }
    )
  }

  if (await isDailyLimitReached(userId)) {
    return NextResponse.json({ error: 'daily_limit_reached' }, { status: 429 })
  }

  const itemList = (items as WardrobeRow[])
    .map(i => {
      const parts = [`- ${i.name}`, i.type.toUpperCase(), i.color || 'unknown']
      if (i.descriptors?.length) parts.push(i.descriptors.join(', '))
      return parts.join(' | ')
    })
    .join('\n')

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    messages: [{
      role: 'user',
      content: `You are Mirror, a fashion stylist. Analyze this user's wardrobe and generate a style profile.\n\nWardrobe:\n${itemList}\n\nGenerate:\n1. archetype: 3-4 word style identity starting with "The" (e.g. "The Quiet Minimalist")\n2. descriptors: exactly 3 single-word UPPERCASE style descriptors\n3. dominant_colors: 3-5 UPPERCASE color names that dominate the wardrobe\n\nRespond with ONLY valid JSON, no other text:\n{"archetype": "The ...", "descriptors": ["...", "...", "..."], "dominant_colors": ["...", "...", "..."]}`
    }]
  })

  const text = response.content[0].type === 'text' ? response.content[0].text.trim() : ''
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) return NextResponse.json({ error: 'Failed to parse response' }, { status: 500 })

  const data = JSON.parse(match[0])

  await supabase
    .from('style_profiles')
    .upsert(
      { user_id: userId, archetype: data.archetype, descriptors: data.descriptors, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    )

  await logUsage(userId, 'style_profile')

  return NextResponse.json(data)
}
