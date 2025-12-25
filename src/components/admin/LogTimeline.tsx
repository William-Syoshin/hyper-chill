'use client'

import Image from 'next/image'
import { VisitLogWithDetails } from '@/types/database'

interface LogTimelineProps {
  logs: VisitLogWithDetails[]
}

export function LogTimeline({ logs }: LogTimelineProps) {
  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-4">
        総チェックイン数: {logs.length}回
      </div>

      <div className="space-y-3">
        {logs.map((log) => {
          const venueColor =
            log.venue_id === 'A'
              ? 'bg-red-100 text-red-800'
              : log.venue_id === 'B'
                ? 'bg-green-100 text-green-800'
                : 'bg-blue-100 text-blue-800'

          return (
            <div
              key={log.id}
              className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200"
            >
              {/* アイコン */}
              {log.user?.icon_image_url && (
                <div className="w-10 h-10 relative rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={log.user.icon_image_url}
                    alt={log.user.nickname || ''}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* ニックネーム */}
              <div className="flex-shrink-0 min-w-[120px]">
                <div className="text-sm font-medium text-gray-900">
                  {log.user?.nickname || '不明'}
                </div>
              </div>

              {/* 矢印 */}
              <div className="flex-shrink-0">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>

              {/* 会場 */}
              <div className="flex-shrink-0">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${venueColor}`}
                >
                  {log.venue?.name || log.venue_id}
                </span>
              </div>

              {/* 日時 */}
              <div className="flex-grow text-right">
                <div className="text-sm text-gray-600">
                  {new Date(log.created_at).toLocaleString('ja-JP', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {logs.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          まだチェックインログがありません
        </div>
      )}
    </div>
  )
}

