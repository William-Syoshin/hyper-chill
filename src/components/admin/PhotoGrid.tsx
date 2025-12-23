'use client'

import { useState } from 'react'
import Image from 'next/image'
import { PhotoWithUser } from '@/types/database'
import { togglePhotoApproval, deletePhoto } from '@/actions/admin'
import { Button } from '@/components/ui/Button'

interface PhotoGridProps {
  photos: PhotoWithUser[]
}

export function PhotoGrid({ photos }: PhotoGridProps) {
  const [processingId, setProcessingId] = useState<number | null>(null)

  const handleToggleApproval = async (
    photoId: number,
    currentStatus: boolean
  ) => {
    setProcessingId(photoId)
    const result = await togglePhotoApproval(photoId, !currentStatus)

    if (result.success) {
      window.location.reload()
    } else {
      alert(result.error)
      setProcessingId(null)
    }
  }

  const handleDelete = async (photoId: number) => {
    if (!confirm('この写真を削除してもよろしいですか？')) {
      return
    }

    setProcessingId(photoId)
    const result = await deletePhoto(photoId)

    if (result.success) {
      window.location.reload()
    } else {
      alert(result.error)
      setProcessingId(null)
    }
  }

  const approvedPhotos = photos.filter((p) => p.approved)
  const pendingPhotos = photos.filter((p) => !p.approved)

  return (
    <div className="space-y-8">
      {/* 統計 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-900">
            {photos.length}
          </div>
          <div className="text-sm text-blue-700">総写真数</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-900">
            {approvedPhotos.length}
          </div>
          <div className="text-sm text-green-700">承認済み</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-900">
            {pendingPhotos.length}
          </div>
          <div className="text-sm text-yellow-700">未承認</div>
        </div>
      </div>

      {/* 承認済み写真 */}
      {approvedPhotos.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">承認済み</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {approvedPhotos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                processingId={processingId}
                onToggleApproval={handleToggleApproval}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}

      {/* 未承認写真 */}
      {pendingPhotos.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">未承認</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {pendingPhotos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                processingId={processingId}
                onToggleApproval={handleToggleApproval}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}

      {photos.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          まだ写真が投稿されていません
        </div>
      )}
    </div>
  )
}

function PhotoCard({
  photo,
  processingId,
  onToggleApproval,
  onDelete,
}: {
  photo: PhotoWithUser
  processingId: number | null
  onToggleApproval: (id: number, currentStatus: boolean) => void
  onDelete: (id: number) => void
}) {
  const isProcessing = processingId === photo.id

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      {/* 画像 */}
      <div className="relative w-full h-48">
        <Image
          src={photo.image_url}
          alt="投稿写真"
          fill
          className="object-cover"
        />
        {photo.approved && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            承認済み
          </div>
        )}
      </div>

      {/* ユーザー情報 */}
      <div className="p-3">
        <div className="text-sm font-medium text-gray-900">
          {photo.user?.nickname || '不明'}
        </div>
        {photo.user?.instagram_id && (
          <div className="text-xs text-gray-600">
            @{photo.user.instagram_id}
          </div>
        )}
        <div className="text-xs text-gray-500 mt-1">
          {new Date(photo.created_at).toLocaleDateString('ja-JP')}
        </div>
      </div>

      {/* アクション */}
      <div className="p-3 pt-0 space-y-2">
        <Button
          variant={photo.approved ? 'secondary' : 'primary'}
          size="sm"
          onClick={() => onToggleApproval(photo.id, photo.approved)}
          disabled={isProcessing}
          className="w-full"
        >
          {photo.approved ? '承認を取り消す' : '承認する'}
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => onDelete(photo.id)}
          disabled={isProcessing}
          className="w-full"
        >
          削除
        </Button>
      </div>
    </div>
  )
}

