'use server'

import { createClient } from '@/lib/supabase/server'
import { getUserIdFromServer } from '@/lib/cookie'
import { validateVenueId, validateUUID } from '@/lib/validation'

/**
 * チェックイン処理
 * QRコードを読み取った際の処理
 */
export async function checkIn(venueId: string) {
  try {
    // 会場IDのバリデーション
    if (!validateVenueId(venueId)) {
      return { success: false, error: '無効な会場IDです' }
    }

    // Cookieからuser_idを取得
    const userId = await getUserIdFromServer()

    if (!userId) {
      // 初めての来場：登録画面へ誘導
      return {
        success: false,
        needsRegistration: true,
        venueId,
      }
    }

    // user_idのバリデーション
    if (!validateUUID(userId)) {
      return { success: false, error: '無効なユーザーIDです' }
    }

    const supabase = await createClient()

    // ユーザーが存在するか確認
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      return { success: false, error: 'ユーザーが見つかりません' }
    }

    // 最新のvisit_logを取得して現在地を確認
    const { data: latestLog } = await supabase
      .from('visit_logs')
      .select('venue_id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    const typedLatestLog = latestLog as { venue_id: string } | null

    // 同じ会場への連続チェックインは無視
    if (typedLatestLog && typedLatestLog.venue_id === venueId) {
      return {
        success: true,
        message: 'すでにこの会場にいます',
        venueId,
        userId,
      }
    }

    // visit_logを追加（会場移動）
    const { error: logError } = await (supabase as any)
      .from('visit_logs')
      .insert({
        user_id: userId,
        venue_id: venueId,
      })

    if (logError) {
      console.error('visit_log insert error:', logError)
      return { success: false, error: 'チェックインに失敗しました' }
    }

    return {
      success: true,
      message: '会場にチェックインしました',
      venueId,
      userId,
    }
  } catch (error) {
    console.error('checkIn error:', error)
    return { success: false, error: 'エラーが発生しました' }
  }
}

/**
 * ユーザーの現在地を取得
 */
export async function getCurrentVenue(userId: string) {
  try {
    if (!validateUUID(userId)) {
      return null
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('visit_logs')
      .select('venue_id, venues(name)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error || !data) {
      return null
    }

    const typedData = data as { venue_id: string; venues: { name: string } | null } | null

    return {
      venue_id: typedData?.venue_id || '',
      venue_name: typedData?.venues?.name || typedData?.venue_id || '',
    }
  } catch (error) {
    console.error('getCurrentVenue error:', error)
    return null
  }
}

