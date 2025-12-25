// 会場ID
export const VENUE_IDS = ['homeplanet', 'movement', 'astro'] as const;
export type VenueId = typeof VENUE_IDS[number];

// 事前登録用の会場ID
export const ENTRANCE_VENUE_ID = 'entrance' as const;

// 全会場ID（事前登録を含む）
export const ALL_VENUE_IDS = [...VENUE_IDS, ENTRANCE_VENUE_ID] as const;
export type AllVenueId = typeof ALL_VENUE_IDS[number];

// Cookie設定
export const COOKIE_NAME = 'hyper_user_id';
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1年

// 画像設定
export const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png'];
export const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

// バリデーション
export const MAX_NICKNAME_LENGTH = 20;
export const MAX_INSTAGRAM_ID_LENGTH = 30;
export const INSTAGRAM_ID_REGEX = /^[a-zA-Z0-9_.]+$/;

// ストレージバケット名
export const STORAGE_BUCKET_ICONS = 'user-icons';
export const STORAGE_BUCKET_PHOTOS = 'event-photos';

// リアルタイム更新間隔（ミリ秒）
export const REALTIME_UPDATE_INTERVAL = 7000; // 7秒

// 写真利用規約文言
export const PHOTO_USAGE_NOTICE = '投稿いただいた写真は、イベント広報物・マガジン等に使用する場合があります';

