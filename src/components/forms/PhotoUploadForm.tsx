'use client'

import { useState, useRef } from 'react'
import { uploadPhoto } from '@/actions/photos'
import { Button } from '@/components/ui/Button'
import { PHOTO_USAGE_NOTICE } from '@/lib/constants'

export function PhotoUploadForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // サイズチェック
    if (file.size > 2 * 1024 * 1024) {
      setError('画像サイズは2MB以内にしてください')
      setPreviewImage(null)
      return
    }

    // 形式チェック
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setError('JPGまたはPNG形式の画像を選択してください')
      setPreviewImage(null)
      return
    }

    setError(undefined)

    // プレビュー表示
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(undefined)
    setSuccess(undefined)

    const formData = new FormData(e.currentTarget)

    const result = await uploadPhoto(formData)

    if (result.success) {
      setSuccess(result.message)
      setPreviewImage(null)
      // フォームをリセット
      if (formRef.current) {
        formRef.current.reset()
      }
      // 3秒後に成功メッセージを消す
      setTimeout(() => setSuccess(undefined), 3000)
    } else {
      setError(result.error)
    }

    setLoading(false)
  }

  return (
    <div className="dark-card rounded-lg p-6">
      <h3 className="text-xl font-bold text-white mb-4 glow-text">
        📷 イベントの思い出を投稿
      </h3>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        {/* プレビュー */}
        {previewImage && (
          <div className="flex justify-center mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewImage}
              alt="プレビュー"
              className="max-w-full h-48 object-contain rounded-lg border-2 border-white/20"
            />
          </div>
        )}

        {/* ファイル選択 */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            写真を選択
          </label>
          <input
            type="file"
            name="photo"
            accept=".jpg,.jpeg,.png"
            onChange={handleImageChange}
            className="w-full px-3 py-2 bg-white/5 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30"
            required
          />
        </div>

        {/* 写真利用規約 */}
        <div className="glass-effect rounded-lg p-3 border-blue-500/30">
          <p className="text-xs text-gray-300">{PHOTO_USAGE_NOTICE}</p>
        </div>

        {/* エラーメッセージ */}
        {error && (
          <div className="glass-effect rounded-lg p-3 border-red-500/30">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* 成功メッセージ */}
        {success && (
          <div className="glass-effect rounded-lg p-3 border-green-500/30">
            <p className="text-sm text-green-400">{success}</p>
          </div>
        )}

        {/* 送信ボタン */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-white/10 hover:bg-white/20 disabled:bg-white/5 text-white font-medium rounded-lg border border-white/20 transition"
        >
          {loading ? 'アップロード中...' : '写真を投稿する'}
        </button>
      </form>
    </div>
  )
}

