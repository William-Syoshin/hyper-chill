'use server'

import { createClient } from '@/lib/supabase/server'
import { validateUUID } from '@/lib/validation'

/**
 * 支払い状態を更新
 */
export async function updatePaymentStatus(userId: string, paid: boolean) {
  try {
    // user_idのバリデーション
    if (!validateUUID(userId)) {
      return { success: false, error: '無効なユーザーIDです' }
    }

    const supabase = await createClient()

    const { error } = await (supabase as any)
      .from('users')
      .update({ ticket_paid: paid })
      .eq('id', userId)

    if (error) {
      console.error('Error updating payment status:', error)
      return { success: false, error: '更新に失敗しました' }
    }

    return { success: true }
  } catch (error) {
    console.error('updatePaymentStatus error:', error)
    return { success: false, error: 'エラーが発生しました' }
  }
}



