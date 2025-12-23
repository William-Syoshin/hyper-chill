'use server'

import { createClient } from '@/lib/supabase/server'
import { getUserIdFromServer } from '@/lib/cookie'
import { STORAGE_BUCKET_PHOTOS } from '@/lib/constants'
import { validateUUID } from '@/lib/validation'
import { Photo } from '@/types/database'

/**
 * 写真をアップロード
 */
export async function uploadPhoto(formData: FormData) {
  try {
    const photoFile = formData.get('photo') as File

    // ユーザーIDを取得
    const userId = await getUserIdFromServer()
    if (!userId) {
      return { success: false, error: 'ログインが必要です' }
    }

    // 画像ファイルのチェック
    if (!photoFile || photoFile.size === 0) {
      return { success: false, error: '写真を選択してください' }
    }

    // ファイルサイズチェック（2MB以内）
    if (photoFile.size > 2 * 1024 * 1024) {
      return { success: false, error: '写真サイズは2MB以内にしてください' }
    }

    // ファイル形式チェック
    if (!['image/jpeg', 'image/png'].includes(photoFile.type)) {
      return { success: false, error: 'JPGまたはPNG形式の画像を選択してください' }
    }

    const supabase = await createClient()

    // 画像をアップロード
    const fileExt = photoFile.name.split('.').pop()
    const fileName = `${userId}-${Date.now()}.${fileExt}`
    const filePath = fileName

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET_PHOTOS)
      .upload(filePath, photoFile, {
        contentType: photoFile.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Photo upload error:', uploadError)
      return { success: false, error: '画像のアップロードに失敗しました' }
    }

    // 画像の公開URLを取得
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET_PHOTOS)
      .getPublicUrl(filePath)

    const photoUrl = urlData.publicUrl

    // photosテーブルに保存
    const { error: dbError } = await supabase
      .from('photos')
      .insert({
        user_id: userId,
        image_url: photoUrl,
        approved: false,
      })

    if (dbError) {
      console.error('Photo DB insert error:', dbError)
      // 画像を削除
      await supabase.storage.from(STORAGE_BUCKET_PHOTOS).remove([filePath])
      return { success: false, error: '写真の保存に失敗しました' }
    }

    return {
      success: true,
      message: '写真をアップロードしました',
    }
  } catch (error) {
    console.error('uploadPhoto error:', error)
    return { success: false, error: 'エラーが発生しました' }
  }
}

/**
 * ユーザーがアップロードした写真を取得
 */
export async function getUserPhotos() {
  try {
    const userId = await getUserIdFromServer()
    if (!userId) {
      return []
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user photos:', error)
      return []
    }

    return (data as Photo[]) || []
  } catch (error) {
    console.error('getUserPhotos error:', error)
    return []
  }
}

/**
 * 指定したユーザーIDの投稿写真を取得
 */
export async function getPhotosByUserId(userId: string): Promise<Photo[]> {
  if (!validateUUID(userId)) {
    console.error('Invalid user ID:', userId)
    return []
  }

  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user photos:', error)
      return []
    }

    return (data as Photo[]) || []
  } catch (error) {
    console.error('getPhotosByUserId error:', error)
    return []
  }
}

