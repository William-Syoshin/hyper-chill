import Cookies from 'js-cookie'
import { COOKIE_NAME, COOKIE_MAX_AGE } from './constants'

/**
 * クライアント側でuser_idを取得
 */
export function getUserId(): string | undefined {
  return Cookies.get(COOKIE_NAME)
}

/**
 * クライアント側でuser_idを保存
 */
export function setUserId(userId: string): void {
  Cookies.set(COOKIE_NAME, userId, {
    expires: COOKIE_MAX_AGE / (60 * 60 * 24), // 日数に変換
    path: '/',
    sameSite: 'lax',
  })
}

/**
 * クライアント側でuser_idを削除
 */
export function removeUserId(): void {
  Cookies.remove(COOKIE_NAME, { path: '/' })
}

/**
 * サーバー側でCookieからuser_idを取得
 */
export async function getUserIdFromServer(): Promise<string | undefined> {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  return cookieStore.get(COOKIE_NAME)?.value
}

/**
 * サーバー側でCookieにuser_idを設定
 */
export async function setUserIdOnServer(userId: string): Promise<void> {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, userId, {
    maxAge: COOKIE_MAX_AGE,
    path: '/',
    sameSite: 'lax',
    httpOnly: false, // クライアント側からも読み取る必要がある
  })
}

