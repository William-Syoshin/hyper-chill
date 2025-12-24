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
  const [searchQuery, setSearchQuery] = useState('')

  // 検索でフィルタリング
  const filteredVisitors = visitors.filter((visitor) => {
    const query = searchQuery.toLowerCase()
    return (
      visitor.nickname.toLowerCase().includes(query) ||
      (visitor.instagram_id && visitor.instagram_id.toLowerCase().includes(query))
    )
  })

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
      {/* 検索バーと統計 */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="text-sm text-gray-600">
          総来場者数: {visitors.length}人
          {searchQuery && (
            <span className="ml-2 text-blue-600">
              （検索結果: {filteredVisitors.length}人）
            </span>
          )}
        </div>
        <div className="w-full sm:w-auto sm:min-w-[300px]">
          <input
            type="text"
            placeholder="名前やInstagram IDで検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
          />
        </div>
      </div>

      {/* デスクトップ表示（768px以上） */}
      <div className="hidden md:block overflow-x-auto">
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
            {filteredVisitors.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  {searchQuery ? '検索結果が見つかりませんでした' : '来場者がいません'}
                </td>
              </tr>
            ) : (
              filteredVisitors.map((visitor) => (
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* モバイル表示（768px未満） */}
      <div className="md:hidden space-y-4">
        {filteredVisitors.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            {searchQuery ? '検索結果が見つかりませんでした' : '来場者がいません'}
          </div>
        ) : (
          filteredVisitors.map((visitor) => (
          <div key={visitor.id} className="bg-white rounded-lg shadow p-4 space-y-3">
            {/* ヘッダー部分（写真と名前） */}
            <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
              <div className="w-16 h-16 relative rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={visitor.icon_image_url}
                  alt={visitor.nickname}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-grow min-w-0">
                <div className="text-base font-semibold text-gray-900 truncate">
                  {visitor.nickname}
                </div>
                {visitor.instagram_id && (
                  <a
                    href={`https://instagram.com/${visitor.instagram_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline truncate block"
                  >
                    @{visitor.instagram_id}
                  </a>
                )}
              </div>
            </div>

            {/* 情報セクション */}
            <div className="space-y-2">
              {/* 現在地 */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">現在地:</span>
                {visitor.current_venue_name ? (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {visitor.current_venue_name}
                  </span>
                ) : (
                  <span className="text-gray-400 text-sm">-</span>
                )}
              </div>

              {/* 登録日時 */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">登録日時:</span>
                <span className="text-sm text-gray-900">
                  {new Date(visitor.created_at).toLocaleString('ja-JP', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>

            {/* アクションボタン */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleToggleTicketPaid(visitor.id, visitor.ticket_paid)}
                disabled={updatingId === visitor.id}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition shadow-sm ${
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
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(visitor.id, visitor.nickname)}
                disabled={deletingId === visitor.id}
                className="px-6"
              >
                {deletingId === visitor.id ? '削除中...' : '削除'}
              </Button>
            </div>
          </div>
          ))
        )}
      </div>
    </div>
  )
}

