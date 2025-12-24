'use client'

import { useState } from 'react'
import Image from 'next/image'
import { UserWithCurrentVenue } from '@/types/database'
import { deleteUser, toggleTicketPaid } from '@/actions/admin'
import { Button } from '@/components/ui/Button'

interface VisitorListProps {
  visitors: UserWithCurrentVenue[]
}

export function VisitorList({ visitors }: VisitorListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const handleDelete = async (userId: string, nickname: string) => {
    if (!confirm(`${nickname}さんを削除してもよろしいですか？`)) {
      return
    }

    setDeletingId(userId)
    const result = await deleteUser(userId)

    if (result.success) {
      alert('削除しました')
      window.location.reload()
    } else {
      alert(result.error)
      setDeletingId(null)
    }
  }

  const handleToggleTicketPaid = async (userId: string, currentStatus: boolean) => {
    setUpdatingId(userId)
    const result = await toggleTicketPaid(userId, !currentStatus)

    if (result.success) {
      window.location.reload()
    } else {
      alert(result.error)
      setUpdatingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-4">
        総来場者数: {visitors.length}人
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                写真
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                LINEの名前
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Instagram
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                現在地
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                チケット支払い
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                登録日時
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {visitors.map((visitor) => (
              <tr key={visitor.id} className="border-t border-gray-200">
                <td className="px-4 py-3">
                  <div className="w-12 h-12 relative rounded-full overflow-hidden">
                    <Image
                      src={visitor.icon_image_url}
                      alt={visitor.nickname}
                      fill
                      className="object-cover"
                    />
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {visitor.nickname}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {visitor.instagram_id ? (
                    <a
                      href={`https://instagram.com/${visitor.instagram_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      @{visitor.instagram_id}
                    </a>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm">
                  {visitor.current_venue_name ? (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {visitor.current_venue_name}
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggleTicketPaid(visitor.id, visitor.ticket_paid)}
                    disabled={updatingId === visitor.id}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition shadow-sm ${
                      visitor.ticket_paid
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-red-500 text-white hover:bg-red-600'
                    } ${updatingId === visitor.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    {updatingId === visitor.id
                      ? '更新中...'
                      : visitor.ticket_paid
                      ? '✓ 支払済み'
                      : '✗ 未払い'}
                  </button>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {new Date(visitor.created_at).toLocaleString('ja-JP')}
                </td>
                <td className="px-4 py-3">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(visitor.id, visitor.nickname)}
                    disabled={deletingId === visitor.id}
                  >
                    {deletingId === visitor.id ? '削除中...' : '削除'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

