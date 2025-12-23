'use server'

import { createAdminClient } from '@/lib/supabase/admin'

/**
 * 特定の会場にいる来場者を取得
 */
export async function getVisitorsByVenue(venueId: string) {
  try {
    const supabase = createAdminClient()

    // 各ユーザーの最新のvisit_logを取得
    const { data: allLogs, error: logsError } = await supabase
      .from('visit_logs')
      .select('user_id, venue_id, created_at')
      .order('created_at', { ascending: false })

    if (logsError) {
      console.error('Error fetching logs:', logsError)
      return []
    }

    // 各ユーザーの最新の会場を取得
    const latestVenues = new Map<string, string>()
    allLogs?.forEach((log) => {
      if (!latestVenues.has(log.user_id)) {
        latestVenues.set(log.user_id, log.venue_id)
      }
    })

    // 指定された会場にいるユーザーIDを抽出
    const userIdsInVenue: string[] = []
    latestVenues.forEach((venue, userId) => {
      if (venue === venueId) {
        userIdsInVenue.push(userId)
      }
    })

    if (userIdsInVenue.length === 0) {
      return []
    }

    // ユーザー情報を取得
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, nickname, icon_image_url, instagram_id')
      .in('id', userIdsInVenue)

    if (usersError) {
      console.error('Error fetching users:', usersError)
      return []
    }

    return users || []
  } catch (error) {
    console.error('getVisitorsByVenue error:', error)
    return []
  }
}

