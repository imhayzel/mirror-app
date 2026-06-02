import { supabase } from './supabase'

export type WardrobeItem = {
  id: string
  user_id: string
  name: string
  type: string
  color: string | null
  image_url: string | null
  descriptors: string[]
  created_at: string
}

export type NewWardrobeItem = Pick<WardrobeItem, 'name' | 'type' | 'color' | 'image_url' | 'descriptors'>

export async function getItems(userId: string): Promise<WardrobeItem[]> {
  const { data, error } = await supabase
    .from('wardrobe_items')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[wardrobe] getItems error:', error)
    throw error
  }
  return data ?? []
}

export async function getItem(id: string): Promise<WardrobeItem> {
  const { data, error } = await supabase
    .from('wardrobe_items')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('[wardrobe] getItem error:', error)
    throw error
  }
  return data
}

export async function addItem(
  item: Omit<NewWardrobeItem, 'descriptors'> & { descriptors?: string[] },
  userId: string
): Promise<WardrobeItem> {
  const { data, error } = await supabase
    .from('wardrobe_items')
    .insert({ descriptors: [], ...item, user_id: userId })
    .select()
    .single()

  if (error) {
    console.error('[wardrobe] addItem error:', error)
    throw error
  }
  return data
}

export async function updateItem(
  id: string,
  updates: Partial<NewWardrobeItem>
): Promise<WardrobeItem> {
  const { data, error } = await supabase
    .from('wardrobe_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('[wardrobe] updateItem error:', error)
    throw error
  }
  return data
}

export async function deleteItem(id: string): Promise<void> {
  const { error } = await supabase
    .from('wardrobe_items')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('[wardrobe] deleteItem error:', error)
    throw error
  }
}
