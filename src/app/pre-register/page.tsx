import { redirect } from 'next/navigation'
import { RegisterForm } from '@/components/forms/RegisterForm'
import { ENTRANCE_VENUE_ID } from '@/lib/constants'
import { getUserIdFromServer } from '@/lib/cookie'

export default async function PreRegisterPage() {
  // すでに登録済みかチェック
  const userId = await getUserIdFromServer()
  
  if (userId) {
    // 登録済みの場合は成功ページへリダイレクト
    redirect(`/success?venue=${ENTRANCE_VENUE_ID}`)
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* タイトル */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 glow-text tracking-wider">
            HYPER CHILL
          </h1>
          <p className="text-gray-400 mt-4">
            イベント事前登録
          </p>
        </div>

        <div className="dark-card rounded-lg p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2 glow-text">
              事前登録
            </h2>
            <p className="text-gray-400 text-sm">
              登録完了後、当日会場でQRコードをスキャンしてください
            </p>
          </div>
          <RegisterForm venueId={ENTRANCE_VENUE_ID} venueName="イベント" />
        </div>
      </div>
    </main>
  )
}

