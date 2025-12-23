'use server'

import { createClient } from '@/lib/supabase/server'
import { setUserIdOnServer } from '@/lib/cookie'
import {
  validateNickname,
  validateInstagramId,
  validateVenueId,
} from '@/lib/validation'
import { STORAGE_BUCKET_ICONS } from '@/lib/constants'

/**
 * ユーザー登録とチェックイン
 */
export async function registerUser(formData: FormData) {
  try {
    const nickname = formData.get('nickname') as string
    const instagramId = formData.get('instagram_id') as string
    const venueId = formData.get('venue_id') as string
    const iconFile = formData.get('icon') as File

    // バリデーション
    const nicknameValidation = validateNickname(nickname)
    if (!nicknameValidation.valid) {
      return { success: false, error: nicknameValidation.error }
    }

    const instagramValidation = validateInstagramId(instagramId)
    if (!instagramValidation.valid) {
      return { success: false, error: instagramValidation.error }
    }

    if (!validateVenueId(venueId)) {
      return { success: false, error: '無効な会場IDです' }
    }

    const supabase = await createClient()

    // 画像URL（デフォルトまたはアップロード後のURL）
    let iconImageUrl = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(nickname) + '&size=200&background=random'
    let uploadedFilePath: string | null = null

    // 画像がアップロードされている場合のみ処理
    if (iconFile && iconFile.size > 0) {
      const fileExt = iconFile.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      uploadedFilePath = fileName

      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET_ICONS)
        .upload(uploadedFilePath, iconFile, {
          contentType: iconFile.type,
          upsert: false,
        })

      if (uploadError) {
        console.error('Image upload error:', uploadError)
        return { success: false, error: '画像のアップロードに失敗しました' }
      }

      // 画像の公開URLを取得
      const { data: urlData } = supabase.storage
        .from(STORAGE_BUCKET_ICONS)
        .getPublicUrl(uploadedFilePath)

      iconImageUrl = urlData.publicUrl
    }

    // ユーザーを作成
    // @ts-ignore - Supabase type inference issue
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        nickname: nickname.trim(),
        instagram_id: instagramId.trim() || null,
        icon_image_url: iconImageUrl,
      })
      .select()
      .single()

    if (userError || !user) {
      console.error('User creation error:', userError)
      // 画像がアップロードされていた場合のみ削除
      if (uploadedFilePath) {
        await supabase.storage.from(STORAGE_BUCKET_ICONS).remove([uploadedFilePath])
      }
      return { success: false, error: 'ユーザー登録に失敗しました' }
    }

    // visit_logを追加（初回チェックイン）
    // @ts-ignore - Supabase type inference issue
    const { error: logError } = await supabase
      .from('visit_logs')
      .insert({
        user_id: user.id,
        venue_id: venueId,
      })

    if (logError) {
      console.error('Visit log creation error:', logError)
      return { success: false, error: 'チェックインに失敗しました' }
    }

    // Cookieにuser_idを保存
    await setUserIdOnServer(user.id)

    return {
      success: true,
      userId: user.id,
      venueId,
    }
  } catch (error) {
    console.error('registerUser error:', error)
    return { success: false, error: 'エラーが発生しました' }
  }
}

/**
 * ユーザー情報を取得
 */
export async function getUserInfo(userId: string) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error || !data) {
      return null
    }

    return data
  } catch (error) {
    console.error('getUserInfo error:', error)
    return null
  }
}

