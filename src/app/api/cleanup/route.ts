import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

// One-time cleanup: remove demo-user rows and duplicate hoodies.
// Call once from a logged-in browser session then delete this file.
export async function POST() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Use service-level access — needs SUPABASE_SERVICE_ROLE_KEY for cross-user deletes.
  // Falls back to user-scoped delete (handles own duplicates only).
  const db = await createServerSupabaseClient()

  // 1. Delete demo-user rows (only possible if RLS not yet applied or via service key)
  const { count: demoCount, error: demoError } = await db
    .from('wardrobe_items')
    .delete({ count: 'exact' })
    .eq('user_id', 'demo-user')

  // 2. Find duplicate hoodies for this user — keep the most recent, delete the rest
  const { data: hoodies } = await db
    .from('wardrobe_items')
    .select('id, name, created_at')
    .eq('user_id', userId)
    .ilike('name', '%hoodie%')
    .order('created_at', { ascending: false })

  let hoodieDeleteCount = 0
  if (hoodies && hoodies.length > 1) {
    // Group by normalised name
    const groups = new Map<string, typeof hoodies>()
    for (const h of hoodies) {
      const key = h.name.toLowerCase().trim()
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key)!.push(h)
    }
    const toDelete: string[] = []
    for (const group of groups.values()) {
      // keep index 0 (most recent), delete the rest
      toDelete.push(...group.slice(1).map(h => h.id))
    }
    if (toDelete.length > 0) {
      const { count } = await db
        .from('wardrobe_items')
        .delete({ count: 'exact' })
        .in('id', toDelete)
        .eq('user_id', userId)
      hoodieDeleteCount = count ?? 0
    }
  }

  return NextResponse.json({
    demo_rows_deleted: demoError ? `error: ${demoError.message}` : (demoCount ?? 0),
    duplicate_hoodies_deleted: hoodieDeleteCount,
  })
}
