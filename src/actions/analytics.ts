'use server'

import { createAdminClient } from '@/lib/supabase/admin'

/**
 * 会場ごとの時系列人数推移を取得
 */
export async function getVenueTimeSeries(
  startDate?: string,
  endDate?: string
) {
  try {
    const supabase = createAdminClient()

    let query = supabase
      .from('visit_logs')
      .select('venue_id, created_at')
      .order('created_at', { ascending: true })

    if (startDate) {
      query = query.gte('created_at', startDate)
    }
    if (endDate) {
      query = query.lte('created_at', endDate)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching time series:', error)
      return []
    }

    return (data as Array<{ venue_id: string; created_at: string }>) || []
  } catch (error) {
    console.error('getVenueTimeSeries error:', error)
    return []
  }
}

/**
 * 会場ごとのピーク時間を取得
 */
export async function getVenuePeakTimes() {
  try {
    const supabase = createAdminClient()

    // すべてのvisit_logsを取得
    const { data: logs, error } = await supabase
      .from('visit_logs')
      .select('user_id, venue_id, created_at')
      .order('created_at', { ascending: true })

    if (error || !logs) {
      console.error('Error fetching logs:', error)
      return []
    }

    // 時間帯ごとに人数を集計
    type HourlyCount = {
      [venueId: string]: {
        [hour: string]: Set<string>
      }
    }

    const hourlyCounts: HourlyCount = {
      A: {},
      B: {},
      C: {},
    }

    // 各ログを時間帯ごとに集計
    ;(logs as Array<{ user_id: string; venue_id: string; created_at: string }>).forEach((log) => {
      const date = new Date(log.created_at)
      const hourKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:00`

      if (!hourlyCounts[log.venue_id][hourKey]) {
        hourlyCounts[log.venue_id][hourKey] = new Set()
      }

      // その時刻時点での会場にいる人を追跡
      // 簡易版：その時間にチェックインした人をカウント
      hourlyCounts[log.venue_id][hourKey].add(log.user_id)
    })

    // 各会場のピーク時間を取得
    const peaks = Object.entries(hourlyCounts).map(([venueId, hours]) => {
      let maxCount = 0
      let peakTime = ''

      Object.entries(hours).forEach(([hour, users]) => {
        if (users.size > maxCount) {
          maxCount = users.size
          peakTime = hour
        }
      })

      return {
        venue_id: venueId,
        peak_time: peakTime,
        peak_count: maxCount,
      }
    })

    return peaks
  } catch (error) {
    console.error('getVenuePeakTimes error:', error)
    return []
  }
}

/**
 * 統計情報を取得
 */
export async function getStatistics() {
  try {
    const supabase = createAdminClient()

    // 総来場者数
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    // 総チェックイン数
    const { count: totalCheckins } = await supabase
      .from('visit_logs')
      .select('*', { count: 'exact', head: true })

    // 承認済み写真数
    const { count: approvedPhotos } = await supabase
      .from('photos')
      .select('*', { count: 'exact', head: true })
      .eq('approved', true)

    // 総写真数
    const { count: totalPhotos } = await supabase
      .from('photos')
      .select('*', { count: 'exact', head: true })

    return {
      totalUsers: totalUsers || 0,
      totalCheckins: totalCheckins || 0,
      approvedPhotos: approvedPhotos || 0,
      totalPhotos: totalPhotos || 0,
    }
  } catch (error) {
    console.error('getStatistics error:', error)
    return {
      totalUsers: 0,
      totalCheckins: 0,
      approvedPhotos: 0,
      totalPhotos: 0,
    }
  }
}

