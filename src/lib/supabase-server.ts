import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function createServerSupabaseClient() {
  try {
    const { getToken } = await auth()
    const supabaseToken = await getToken({ template: 'supabase' }).catch(() => null)
    if (supabaseToken) {
      return createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: `Bearer ${supabaseToken}` } },
      })
    }
  } catch {
    // Clerk template not configured — fall through to anon client
  }
  return createClient(supabaseUrl, supabaseAnonKey)
}
