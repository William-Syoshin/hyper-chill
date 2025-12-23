import {
  MAX_NICKNAME_LENGTH,
  MAX_INSTAGRAM_ID_LENGTH,
  INSTAGRAM_ID_REGEX,
  MAX_IMAGE_SIZE,
  ALLOWED_IMAGE_TYPES,
  VENUE_IDS,
  type VenueId,
} from './constants'

export type ValidationResult = {
  valid: boolean
  error?: string
}

/**
 * ニックネームのバリデーション
 */
export function validateNickname(nickname: string): ValidationResult {
  if (!nickname || nickname.trim().length === 0) {
    return { valid: false, error: 'ニックネームを入力してください' }
  }
  if (nickname.length > MAX_NICKNAME_LENGTH) {
    return { valid: false, error: `ニックネームは${MAX_NICKNAME_LENGTH}文字以内で入力してください` }
  }
  return { valid: true }
}

/**
 * Instagram IDのバリデーション
 */
export function validateInstagramId(instagramId: string): ValidationResult {
  if (!instagramId || instagramId.trim().length === 0) {
    // 任意項目なので空欄はOK
    return { valid: true }
  }
  
  if (instagramId.length > MAX_INSTAGRAM_ID_LENGTH) {
    return { valid: false, error: `Instagram IDは${MAX_INSTAGRAM_ID_LENGTH}文字以内で入力してください` }
  }
  
  if (!INSTAGRAM_ID_REGEX.test(instagramId)) {
    return { valid: false, error: 'Instagram IDは英数字、アンダースコア、ドットのみ使用できます' }
  }
  
  return { valid: true }
}

/**
 * 画像ファイルのバリデーション
 */
export function validateImage(file: File): ValidationResult {
  if (!file) {
    return { valid: false, error: '写真を選択してください' }
  }
  
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: 'JPGまたはPNG形式の画像を選択してください' }
  }
  
  if (file.size > MAX_IMAGE_SIZE) {
    const sizeMB = (MAX_IMAGE_SIZE / (1024 * 1024)).toFixed(0)
    return { valid: false, error: `画像サイズは${sizeMB}MB以内にしてください` }
  }
  
  return { valid: true }
}

/**
 * 会場IDのバリデーション
 */
export function validateVenueId(venueId: string): venueId is VenueId {
  return VENUE_IDS.includes(venueId as VenueId)
}

/**
 * UUIDのバリデーション
 */
export function validateUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

