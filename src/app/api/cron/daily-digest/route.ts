import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

async function fetchMetrics() {
  const db = serviceClient()
  const now = new Date()
  const todayStart = new Date(now)
  todayStart.setUTCHours(0, 0, 0, 0)
  const todayISO = todayStart.toISOString()
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()

  const [
    { data: userRows },
    { data: dauWardrobe },
    { data: dauOutfits },
    { data: dauUsage },
    { count: newItems },
    { count: suggestionsToday },
    { count: wornToday },
    { data: limitHitters },
  ] = await Promise.all([
    // Total users — distinct user_ids across wardrobe_items
    db.from('wardrobe_items').select('user_id'),

    // DAU — activity in last 24h across tables
    db.from('wardrobe_items').select('user_id').gte('created_at', yesterday),
    db.from('outfit_suggestions').select('user_id').gte('created_at', yesterday),
    db.from('ai_usage').select('user_id').gte('created_at', yesterday),

    // New items added today
    db.from('wardrobe_items')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', todayISO),

    // Outfit suggestions today
    db.from('outfit_suggestions')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', todayISO),

    // Confirmed outfits today (worn=true)
    db.from('outfit_suggestions')
      .select('*', { count: 'exact', head: true })
      .eq('worn', true)
      .gte('created_at', todayISO),

    // Users who hit the daily AI limit today (≥5 calls)
    db.from('ai_usage').select('user_id').gte('created_at', todayISO),
  ])

  // Total unique users
  const totalUsers = new Set((userRows ?? []).map(r => r.user_id)).size

  // DAU — union of unique users across all tables in last 24h
  const dauSet = new Set([
    ...(dauWardrobe ?? []).map(r => r.user_id),
    ...(dauOutfits ?? []).map(r => r.user_id),
    ...(dauUsage ?? []).map(r => r.user_id),
  ])
  const dau = dauSet.size

  // Users hitting the daily limit — 5+ ai_usage rows today
  const usageCountByUser = new Map<string, number>()
  for (const row of limitHitters ?? []) {
    usageCountByUser.set(row.user_id, (usageCountByUser.get(row.user_id) ?? 0) + 1)
  }
  const limitHitCount = [...usageCountByUser.values()].filter(c => c >= 5).length

  // Confirmation rate
  const totalSuggestions = suggestionsToday ?? 0
  const totalWorn = wornToday ?? 0
  const confirmRate =
    totalSuggestions > 0
      ? `${Math.round((totalWorn / totalSuggestions) * 100)}%`
      : '—'

  return {
    totalUsers,
    dau,
    newItems: newItems ?? 0,
    suggestionsToday: totalSuggestions,
    wornToday: totalWorn,
    confirmRate,
    limitHitCount,
  }
}

function formatMessage(m: Awaited<ReturnType<typeof fetchMetrics>>): string {
  const date = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kuala_Lumpur',
  })

  return [
    `*Mirror — Daily Digest*`,
    `_${date}_`,
    ``,
    `👥 *Users:* ${m.totalUsers} total · ${m.dau} active today`,
    `👔 *Wardrobe:* ${m.newItems} items added`,
    `✨ *Outfits:* ${m.suggestionsToday} suggested · ${m.wornToday} confirmed (${m.confirmRate})`,
    `⚡ *Limit hits:* ${m.limitHitCount} user${m.limitHitCount !== 1 ? 's' : ''} at 5/day`,
  ].join('\n')
}

async function sendTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) throw new Error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID')

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Telegram API error ${res.status}: ${body}`)
  }
}

export async function GET(req: Request) {
  // Vercel cron requests include this header; reject anything else in production
  const authHeader = req.headers.get('authorization')
  if (
    process.env.NODE_ENV === 'production' &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const metrics = await fetchMetrics()
    const message = formatMessage(metrics)
    await sendTelegram(message)
    return NextResponse.json({ ok: true, metrics })
  } catch (err) {
    console.error('[daily-digest]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
