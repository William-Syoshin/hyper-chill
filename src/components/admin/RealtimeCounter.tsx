'use client'

import { useEffect, useState } from 'react'
import { getVenueCounts } from '@/actions/admin'
import { VenueWithCount } from '@/types/database'
import { REALTIME_UPDATE_INTERVAL } from '@/lib/constants'
import { VenueMap } from './VenueMap'

interface RealtimeCounterProps {
  initialVenues: VenueWithCount[]
  darkMode?: boolean
}

export function RealtimeCounter({ initialVenues, darkMode = false }: RealtimeCounterProps) {
  const [venues, setVenues] = useState<VenueWithCount[]>(initialVenues)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  useEffect(() => {
    const fetchVenues = async () => {
      const data = await getVenueCounts()
      setVenues(data as VenueWithCount[])
      setLastUpdated(new Date())
    }

    const interval = setInterval(fetchVenues, REALTIME_UPDATE_INTERVAL)

    return () => clearInterval(interval)
  }, [])

  const totalCount = venues.reduce((sum, v) => sum + v.current_count, 0)

  if (darkMode) {
    return (
      <div className="space-y-6">
        {/* 総人数 (ダークモード) */}
        <div className="glass-effect rounded-lg p-6 border-purple-500/30">
          <div className="text-center">
            <div className="text-sm font-medium text-gray-400 mb-2">現在の総来場者数</div>
            <div className="text-5xl font-bold text-white glow-text">{totalCount}</div>
            <div className="text-xs mt-2 text-gray-500">
              最終更新: {lastUpdated.toLocaleTimeString('ja-JP')}
            </div>
          </div>
        </div>

        {/* 会場マップ (ダークモード) */}
        <VenueMap venues={venues} darkMode={true} />

        {/* 会場別人数一覧 (ダークモード) */}
        <div className="grid grid-cols-3 gap-4">
          {venues.map((venue) => {
            const borderColor =
              venue.id === 'homeplanet'
                ? 'rgba(139, 85, 85, 0.5)' // 灰色がかった赤
                : venue.id === 'movement'
                  ? 'rgba(85, 139, 85, 0.5)' // 灰色がかった緑
                  : 'rgba(85, 101, 139, 0.5)' // 灰色がかった青

            return (
              <div
                key={venue.id}
                className="glass-effect border-2 rounded-lg p-4 text-center"
                style={{ borderColor }}
              >
                <div className="text-lg font-semibold text-gray-300">
                  {venue.name}
                </div>
                <div className="text-4xl font-bold text-white mt-2">
                  {venue.current_count}
                </div>
                <div className="text-sm text-gray-500 mt-1">人</div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 総人数 */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-6 shadow-lg">
        <div className="text-center">
          <div className="text-sm font-medium mb-2">現在の総来場者数</div>
          <div className="text-5xl font-bold">{totalCount}</div>
          <div className="text-xs mt-2 opacity-80">
            最終更新: {lastUpdated.toLocaleTimeString('ja-JP')}
          </div>
        </div>
      </div>

      {/* 会場マップ */}
      <VenueMap venues={venues} />

      {/* 会場別人数一覧 */}
      <div className="grid grid-cols-3 gap-4">
        {venues.map((venue) => {
          const borderColor =
            venue.id === 'homeplanet'
              ? '#8b5555' // 灰色がかった赤
              : venue.id === 'movement'
                ? '#558b55' // 灰色がかった緑
                : '#55658b' // 灰色がかった青
          
          const bgColor =
            venue.id === 'homeplanet'
              ? '#f5f0f0' // 淡い赤
              : venue.id === 'movement'
                ? '#f0f5f0' // 淡い緑
                : '#f0f2f5' // 淡い青

          return (
            <div
              key={venue.id}
              className="border-2 rounded-lg p-4 text-center"
              style={{ borderColor, backgroundColor: bgColor }}
            >
              <div className="text-lg font-semibold text-gray-700">
                {venue.name}
              </div>
              <div className="text-4xl font-bold text-gray-900 mt-2">
                {venue.current_count}
              </div>
              <div className="text-sm text-gray-600 mt-1">人</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

