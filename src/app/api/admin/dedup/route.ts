import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

// One-time cleanup: deletes older duplicate wardrobe items matching a pattern.
// GET /api/admin/dedup?pattern=striped+zip
export async function GET(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const pattern = searchParams.get('pattern') ?? 'striped zip'

  const db = await createServerSupabaseClient()

  // Fetch all matching items for this user, oldest first
  const { data, error } = await db
    .from('wardrobe_items')
    .select('id, name, created_at')
    .eq('user_id', userId)
    .ilike('name', `%${pattern}%`)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data || data.length <= 1) {
    return NextResponse.json({ deleted: 0, message: 'No duplicates found.' })
  }

  // Keep the newest (last), delete all older ones
  const toDelete = data.slice(0, data.length - 1).map(r => r.id)

  const { error: delError } = await db
    .from('wardrobe_items')
    .delete()
    .in('id', toDelete)
    .eq('user_id', userId)

  if (delError) return NextResponse.json({ error: delError.message }, { status: 500 })

  return NextResponse.json({ deleted: toDelete.length, kept: data[data.length - 1] })
}
