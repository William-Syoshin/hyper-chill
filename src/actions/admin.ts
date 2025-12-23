'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import type { Venue, User, VisitLog, Photo } from '@/types/database'

/**
 * 会場ごとの現在人数を取得
 */
export async function getVenueCounts() {
  try {
    const supabase = createAdminClient()

    // 各ユーザーの最新のvisit_logを取得し、会場ごとに集計
    const { data, error } = await supabase.rpc('get_venue_counts')

    if (error) {
      // カスタム関数がない場合は、クエリで取得
      const { data: logs, error: logsError } = await supabase
        .from('visit_logs')
        .select('user_id, venue_id, created_at')
        .order('created_at', { ascending: false })

      if (logsError || !logs) {
        console.error('Error fetching visit logs:', logsError)
        return []
      }

      // 各ユーザーの最新のvenueを取得
      const latestVenues = new Map<string, string>()
      ;(logs as Array<{ user_id: string; venue_id: string; created_at: string }>).forEach((log) => {
        if (!latestVenues.has(log.user_id)) {
          latestVenues.set(log.user_id, log.venue_id)
        }
      })

      // 会場ごとにカウント
      const counts: { [key: string]: number } = { A: 0, B: 0, C: 0 }
      latestVenues.forEach((venueId) => {
        counts[venueId] = (counts[venueId] || 0) + 1
      })

      // 会場情報を取得
      const { data: venues } = await supabase
        .from('venues')
        .select('*')
        .order('id')

      return (
        (venues as Venue[] | null)?.map((venue) => ({
          ...venue,
          current_count: counts[venue.id] || 0,
        })) || []
      )
    }

    return data || []
  } catch (error) {
    console.error('getVenueCounts error:', error)
    return []
  }
}

/**
 * 来場者一覧を取得
 */
export async function getVisitors() {
  try {
    const supabase = createAdminClient()

    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching users:', error)
      return []
    }

    // 各ユーザーの現在地を取得
    const usersWithVenue = await Promise.all(
      ((users as User[] | null) || []).map(async (user) => {
        const { data: latestLog } = await supabase
          .from('visit_logs')
          .select('venue_id, venues(name)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        const typedLog = latestLog as { venue_id: string; venues: { name: string } | null } | null

        return {
          ...user,
          current_venue_id: typedLog?.venue_id,
          current_venue_name: typedLog?.venues?.name,
        }
      })
    )

    return usersWithVenue
  } catch (error) {
    console.error('getVisitors error:', error)
    return []
  }
}

/**
 * 移動ログを取得
 */
export async function getVisitLogs(limit = 100) {
  try {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('visit_logs')
      .select(
        `
        *,
        user:users(nickname, icon_image_url),
        venue:venues(name)
      `
      )
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching visit logs:', error)
      return []
    }

    return (data as any[]) || []
  } catch (error) {
    console.error('getVisitLogs error:', error)
    return []
  }
}

/**
 * ユーザーを削除
 */
export async function deleteUser(userId: string) {
  try {
    const supabase = createAdminClient()

    // ユーザーを削除（ON DELETE CASCADEにより関連データも削除される）
    const { error } = await supabase.from('users').delete().eq('id', userId)

    if (error) {
      console.error('Error deleting user:', error)
      return { success: false, error: '削除に失敗しました' }
    }

    return { success: true }
  } catch (error) {
    console.error('deleteUser error:', error)
    return { success: false, error: 'エラーが発生しました' }
  }
}

/**
 * 写真一覧を取得
 */
export async function getPhotos() {
  try {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('photos')
      .select(
        `
        *,
        user:users(nickname, instagram_id)
      `
      )
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching photos:', error)
      return []
    }

    return (data as any[]) || []
  } catch (error) {
    console.error('getPhotos error:', error)
    return []
  }
}

/**
 * 写真の承認状態を切り替え
 */
export async function togglePhotoApproval(photoId: number, approved: boolean) {
  try {
    const supabase = createAdminClient()

    const { error } = await supabase
      .from('photos')
      .update({ approved })
      .eq('id', photoId)

    if (error) {
      console.error('Error updating photo:', error)
      return { success: false, error: '更新に失敗しました' }
    }

    return { success: true }
  } catch (error) {
    console.error('togglePhotoApproval error:', error)
    return { success: false, error: 'エラーが発生しました' }
  }
}

/**
 * 写真を削除
 */
export async function deletePhoto(photoId: number) {
  try {
    const supabase = createAdminClient()

    const { error } = await supabase.from('photos').delete().eq('id', photoId)

    if (error) {
      console.error('Error deleting photo:', error)
      return { success: false, error: '削除に失敗しました' }
    }

    return { success: true }
  } catch (error) {
    console.error('deletePhoto error:', error)
    return { success: false, error: 'エラーが発生しました' }
  }
}

