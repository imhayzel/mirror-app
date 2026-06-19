import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const score: number | undefined = body.score
  const best_feature: string | undefined = body.best_feature
  const improvement: string | undefined = body.improvement

  if (typeof score !== 'number' || score < 0 || score > 10) {
    return NextResponse.json({ error: 'Invalid score' }, { status: 400 })
  }

  const db = await createServerSupabaseClient()
  const { error } = await db.from('nps_responses').insert({
    user_id: userId,
    score,
    best_feature: best_feature?.trim() || null,
    improvement: improvement?.trim() || null,
  })

  if (error) {
    console.error('[nps]', error)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
