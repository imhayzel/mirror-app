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

type WardrobeRow = { id: string; name: string; type: string; color: string | null; image_url: string | null }

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (await isDailyLimitReached(userId)) {
    return NextResponse.json({ error: 'daily_limit_reached' }, { status: 429 })
  }

  const body = await req.json().catch(() => ({}))
  const context: string | undefined = body.context

  const { data: items } = await supabase
    .from('wardrobe_items')
    .select('id, name, type, color, image_url')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (!items || items.length < 2) {
    return NextResponse.json({ error: 'not_enough_items' }, { status: 400 })
  }

  const itemList = (items as WardrobeRow[])
    .map(i => `- ID: ${i.id} | ${i.name} | ${i.type.toUpperCase()} | Color: ${i.color || 'unknown'}`)
    .join('\n')

  const contextLine = context
    ? `Context/occasion: ${context}`
    : 'Suggest a complete outfit for today.'

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    messages: [{
      role: 'user',
      content: `You are Mirror, a personal stylist with a minimal, editorial sensibility. The user has these wardrobe items:\n${itemList}\n\n${contextLine}\n\nRules:\n- Pick 3-4 items that work well together\n- Must include at least one top and one bottom (or a dress/jumpsuit as substitute)\n- Consider color harmony and the context\n- Outfit name: short, poetic, 4-5 words, no punctuation\n- Reasoning: 1-2 sentences, fashion editor voice, no exclamation marks\n\nRespond with ONLY valid JSON, no other text:\n{"outfit_name": "...", "item_ids": ["id1", "id2", "id3"], "reasoning": "..."}`
    }]
  })

  const text = response.content[0].type === 'text' ? response.content[0].text.trim() : ''
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) return NextResponse.json({ error: 'Failed to parse response' }, { status: 500 })

  const parsed = JSON.parse(match[0])
  const selectedItems = (items as WardrobeRow[]).filter(i => (parsed.item_ids as string[]).includes(i.id))

  await logUsage(userId, 'outfit')

  return NextResponse.json({
    outfit_name: parsed.outfit_name as string,
    reasoning: parsed.reasoning as string,
    items: selectedItems,
  })
}
