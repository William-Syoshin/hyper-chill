'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { PhotoWithUser } from '@/types/database'
import { togglePhotoApproval, deletePhoto } from '@/actions/admin'
import { Button } from '@/components/ui/Button'

interface PhotoGridProps {
  photos: PhotoWithUser[]
}

export function PhotoGrid({ photos }: PhotoGridProps) {
  const [processingId, setProcessingId] = useState<number | null>(null)
  const [approvedPage, setApprovedPage] = useState(1)
  const [pendingPage, setPendingPage] = useState(1)
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoWithUser | null>(null)
  const [mounted, setMounted] = useState(false)
  const ITEMS_PER_PAGE = 20

  useEffect(() => {
    setMounted(true)
  }, [])

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

  const handlePhotoClick = (photo: PhotoWithUser) => {
    setSelectedPhoto(photo)
  }

  const handleClosePhoto = () => {
    setSelectedPhoto(null)
  }

  const handleDownload = async (photo: PhotoWithUser) => {
    try {
      const response = await fetch(photo.image_url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `photo-${photo.id}-${photo.user?.nickname || 'unknown'}.jpg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download error:', error)
      alert('ダウンロードに失敗しました')
    }
  }

  const approvedPhotos = photos.filter((p) => p.approved)
  const pendingPhotos = photos.filter((p) => !p.approved)

  // ページネーション計算
  const approvedTotalPages = Math.ceil(approvedPhotos.length / ITEMS_PER_PAGE)
  const pendingTotalPages = Math.ceil(pendingPhotos.length / ITEMS_PER_PAGE)

  const approvedStartIndex = (approvedPage - 1) * ITEMS_PER_PAGE
  const approvedEndIndex = approvedStartIndex + ITEMS_PER_PAGE
  const displayedApprovedPhotos = approvedPhotos.slice(approvedStartIndex, approvedEndIndex)

  const pendingStartIndex = (pendingPage - 1) * ITEMS_PER_PAGE
  const pendingEndIndex = pendingStartIndex + ITEMS_PER_PAGE
  const displayedPendingPhotos = pendingPhotos.slice(pendingStartIndex, pendingEndIndex)

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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">
              承認済み（{approvedPhotos.length}枚）
            </h3>
            {approvedTotalPages > 1 && (
              <div className="text-sm text-gray-600">
                {approvedPage} / {approvedTotalPages} ページ
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayedApprovedPhotos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                processingId={processingId}
                onToggleApproval={handleToggleApproval}
                onDelete={handleDelete}
                onPhotoClick={handlePhotoClick}
              />
            ))}
          </div>
          {approvedTotalPages > 1 && (
            <Pagination
              currentPage={approvedPage}
              totalPages={approvedTotalPages}
              onPageChange={setApprovedPage}
            />
          )}
        </div>
      )}

      {/* 未承認写真 */}
      {pendingPhotos.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">
              未承認（{pendingPhotos.length}枚）
            </h3>
            {pendingTotalPages > 1 && (
              <div className="text-sm text-gray-600">
                {pendingPage} / {pendingTotalPages} ページ
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayedPendingPhotos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                processingId={processingId}
                onToggleApproval={handleToggleApproval}
                onDelete={handleDelete}
                onPhotoClick={handlePhotoClick}
              />
            ))}
          </div>
          {pendingTotalPages > 1 && (
            <Pagination
              currentPage={pendingPage}
              totalPages={pendingTotalPages}
              onPageChange={setPendingPage}
            />
          )}
        </div>
      )}

      {photos.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          まだ写真が投稿されていません
        </div>
      )}

      {/* ライトボックス（Portal経由でbodyに表示） */}
      {mounted && selectedPhoto && createPortal(
        <div 
          className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-[10001]" 
          onClick={handleClosePhoto}
        >
          {/* 閉じるボタン */}
          <button
            onClick={handleClosePhoto}
            className="absolute top-4 right-4 text-white text-5xl font-bold hover:text-gray-300 transition z-10"
          >
            ×
          </button>

          {/* ダウンロードボタン */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleDownload(selectedPhoto)
            }}
            className="absolute top-4 left-4 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition z-10 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            ダウンロード
          </button>

          {/* 拡大写真 */}
          <div className="relative w-full h-full flex items-center justify-center p-8">
            <div className="relative max-w-7xl max-h-full w-full h-full">
              <Image
                src={selectedPhoto.image_url}
                alt="投稿写真"
                fill
                className="object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* 写真情報 */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 px-6 py-4 rounded-lg text-white">
            <div className="text-center">
              <div className="font-semibold">{selectedPhoto.user?.nickname || '不明'}</div>
              {selectedPhoto.user?.instagram_id && (
                <div className="text-sm text-gray-300">@{selectedPhoto.user.instagram_id}</div>
              )}
              <div className="text-xs text-gray-400 mt-1">
                {new Date(selectedPhoto.created_at).toLocaleString('ja-JP')}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

function PhotoCard({
  photo,
  processingId,
  onToggleApproval,
  onDelete,
  onPhotoClick,
}: {
  photo: PhotoWithUser
  processingId: number | null
  onToggleApproval: (id: number, currentStatus: boolean) => void
  onDelete: (id: number) => void
  onPhotoClick: (photo: PhotoWithUser) => void
}) {
  const isProcessing = processingId === photo.id

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      {/* 画像 */}
      <div 
        className="relative w-full h-48 cursor-pointer group"
        onClick={() => onPhotoClick(photo)}
      >
        <Image
          src={photo.image_url}
          alt="投稿写真"
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* クリック可能を示すオーバーレイ */}
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-300 flex items-center justify-center">
          <div className="text-white text-4xl">🔍</div>
        </div>
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

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  const pages = []
  const maxVisiblePages = 5

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ← 前へ
      </button>

      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            1
          </button>
          {startPage > 2 && <span className="text-gray-400">...</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 border rounded-lg text-sm font-medium ${
            page === currentPage
              ? 'bg-blue-500 text-white border-blue-500'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="text-gray-400">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        次へ →
      </button>
    </div>
  )
}

