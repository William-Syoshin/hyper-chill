'use client'

import { useState } from 'react'
import Image from 'next/image'
import { UserWithCurrentVenue } from '@/types/database'
import { deleteUser } from '@/actions/admin'
import { Button } from '@/components/ui/Button'

interface VisitorListProps {
  visitors: UserWithCurrentVenue[]
}

export function VisitorList({ visitors }: VisitorListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

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
                ニックネーム
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Instagram
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                現在地
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

