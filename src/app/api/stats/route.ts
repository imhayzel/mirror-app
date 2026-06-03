import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = await createServerSupabaseClient()

  const [piecesRes, outfitsRes, confirmedRes, profileRes] = await Promise.all([
    db.from('wardrobe_items').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    db.from('outfit_suggestions').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    db.from('outfit_suggestions').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('worn', true),
    db.from('style_profiles').select('archetype, descriptors').eq('user_id', userId).maybeSingle(),
  ])

  return NextResponse.json({
    pieces: piecesRes.count ?? 0,
    outfits: outfitsRes.count ?? 0,
    confirmed: confirmedRes.count ?? 0,
    profile: profileRes.data ?? null,
  })
}
