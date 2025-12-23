'use client'

import { useEffect, useState } from 'react'
import { getVenueCounts } from '@/actions/admin'
import { VenueWithCount } from '@/types/database'
import { REALTIME_UPDATE_INTERVAL } from '@/lib/constants'

interface VenueCountDisplayProps {
  initialVenues: VenueWithCount[]
}

export function VenueCountDisplay({ initialVenues }: VenueCountDisplayProps) {
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">
          🗺️ 現在の会場別人数
        </h3>
        <span className="text-xs text-gray-500">
          更新: {lastUpdated.toLocaleTimeString('ja-JP')}
        </span>
      </div>

      {/* 総人数 */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4 mb-4 text-center">
        <div className="text-sm text-gray-700 mb-1">総来場者数</div>
        <div className="text-3xl font-bold text-purple-900">{totalCount}人</div>
      </div>

      {/* 会場別 */}
      <div className="grid grid-cols-3 gap-3">
        {venues.map((venue) => {
          const color =
            venue.id === 'A'
              ? 'border-red-300 bg-red-50 text-red-900'
              : venue.id === 'B'
                ? 'border-green-300 bg-green-50 text-green-900'
                : 'border-blue-300 bg-blue-50 text-blue-900'

          return (
            <div
              key={venue.id}
              className={`${color} border-2 rounded-lg p-3 text-center`}
            >
              <div className="text-sm font-semibold mb-1">{venue.name}</div>
              <div className="text-2xl font-bold">{venue.current_count}</div>
              <div className="text-xs mt-1">人</div>
            </div>
          )
        })}
      </div>

      <p className="text-xs text-gray-500 text-center mt-4">
        ※ {REALTIME_UPDATE_INTERVAL / 1000}秒ごとに自動更新
      </p>
    </div>
  )
}

