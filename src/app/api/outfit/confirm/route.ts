import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const { items, reasoning, outfit_name } = body

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'items required' }, { status: 400 })
  }

  const db = await createServerSupabaseClient()
  const row: Record<string, unknown> = {
    user_id: userId,
    items,
    reasoning: reasoning ?? '',
    worn: true,
  }
  if (outfit_name) row.outfit_name = outfit_name

  const { data, error } = await db.from('outfit_suggestions').insert(row).select('id').single()

  if (error) {
    console.error('[outfit/confirm] insert failed', { userId, error: error.message, code: error.code, details: error.details })
    return NextResponse.json({ error: error.message, code: error.code }, { status: 500 })
  }

  console.log('[outfit/confirm] saved', data?.id, 'for user', userId)
  return NextResponse.json({ ok: true, id: data?.id })
}
