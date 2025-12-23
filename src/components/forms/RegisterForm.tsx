'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { registerUser } from '@/actions/register'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  validateNickname,
  validateInstagramId,
  validateImage,
} from '@/lib/validation'
import { PHOTO_USAGE_NOTICE } from '@/lib/constants'
import { setUserId } from '@/lib/cookie'

interface RegisterFormProps {
  venueId: string
  venueName: string
}

export function RegisterForm({ venueId, venueName }: RegisterFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{
    nickname?: string
    instagramId?: string
    icon?: string
    general?: string
  }>({})
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validation = validateImage(file)
    if (!validation.valid) {
      setErrors((prev) => ({ ...prev, icon: validation.error }))
      setPreviewImage(null)
      return
    }

    setErrors((prev) => ({ ...prev, icon: undefined }))

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
    setErrors({})

    const formData = new FormData(e.currentTarget)
    const nickname = formData.get('nickname') as string
    const instagramId = formData.get('instagram_id') as string
    const iconFile = formData.get('icon') as File

    // クライアント側バリデーション
    const nicknameValidation = validateNickname(nickname)
    const instagramValidation = validateInstagramId(instagramId)
    
    // 画像が選択されている場合のみバリデーション
    let imageValidation = { valid: true, error: undefined }
    if (iconFile && iconFile.size > 0) {
      imageValidation = validateImage(iconFile)
    }

    if (
      !nicknameValidation.valid ||
      !instagramValidation.valid ||
      !imageValidation.valid
    ) {
      setErrors({
        nickname: nicknameValidation.error,
        instagramId: instagramValidation.error,
        icon: imageValidation.error,
      })
      setLoading(false)
      return
    }

    // 会場IDを追加
    formData.append('venue_id', venueId)

    // サーバーアクション実行
    const result = await registerUser(formData)

    if (result.success) {
      // Cookieに保存（クライアント側でも）
      if (result.userId) {
        setUserId(result.userId)
      }
      // 成功画面へリダイレクト
      router.push(`/success?venue=${venueId}`)
    } else {
      setErrors({ general: result.error })
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 glow-text">
          {venueName}へようこそ！
        </h2>
        <p className="text-gray-400">初回登録を行います</p>
      </div>

      {/* 写真アップロード */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          写真（任意）
        </label>
        {previewImage && (
          <div className="mb-3 flex justify-center">
            <img
              src={previewImage}
              alt="プレビュー"
              className="w-32 h-32 object-cover rounded-full border-4 border-white/20"
            />
          </div>
        )}
        <input
          type="file"
          name="icon"
          accept=".jpg,.jpeg,.png"
          onChange={handleImageChange}
          className="w-full px-3 py-2 bg-white/5 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30"
        />
        {errors.icon && (
          <p className="mt-1 text-sm text-red-400">{errors.icon}</p>
        )}
      </div>

      {/* ニックネーム */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          ニックネーム<span className="text-red-400 ml-1">*</span>
        </label>
        <input
          type="text"
          name="nickname"
          maxLength={20}
          required
          className="w-full px-3 py-2 bg-white/5 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30"
        />
        {errors.nickname && (
          <p className="mt-1 text-sm text-red-400">{errors.nickname}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">20文字以内</p>
      </div>

      {/* Instagram ID */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Instagram ID（任意）
        </label>
        <input
          type="text"
          name="instagram_id"
          maxLength={30}
          placeholder="例: taro_yamada"
          className="w-full px-3 py-2 bg-white/5 border border-white/20 text-white placeholder-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30"
        />
        {errors.instagramId && (
          <p className="mt-1 text-sm text-red-400">{errors.instagramId}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">@なしで入力してください（30文字以内）</p>
      </div>

      {/* 写真利用規約 */}
      <div className="glass-effect rounded-lg p-4 border-blue-500/30">
        <p className="text-sm text-gray-300">{PHOTO_USAGE_NOTICE}</p>
      </div>

      {/* エラーメッセージ */}
      {errors.general && (
        <div className="glass-effect rounded-lg p-4 border-red-500/30">
          <p className="text-sm text-red-400">{errors.general}</p>
        </div>
      )}

      {/* 送信ボタン */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-white/10 hover:bg-white/20 disabled:bg-white/5 text-white font-medium rounded-lg border border-white/20 transition"
      >
        {loading ? '登録中...' : '登録してチェックイン'}
      </button>
    </form>
  )
}

