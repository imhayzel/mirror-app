import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { addItem } from '@/lib/wardrobe'

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const item = await req.json()

  try {
    const db = await createServerSupabaseClient()
    const result = await addItem(item, userId, db)
    return NextResponse.json(result)
  } catch (err) {
    console.error('[wardrobe/add]', err)
    return NextResponse.json({ error: 'Failed to save item' }, { status: 500 })
  }
}
