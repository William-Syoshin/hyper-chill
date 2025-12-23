import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { getUserIdFromServer } from '@/lib/cookie'
import { PhotoUploadForm } from '@/components/forms/PhotoUploadForm'
import { RealtimeCounter } from '@/components/admin/RealtimeCounter'
import { getVenueCounts } from '@/actions/admin'
import { VenueWithCount } from '@/types/database'
import { AnimatedBackground } from '@/components/AnimatedBackground'

async function SuccessContent({
  venueId,
}: {
  venueId: string | null
}) {
  const supabase = await createClient()
  const userId = await getUserIdFromServer()

  let venueName = venueId ? `会場${venueId}` : '会場'
  let userName = ''

  if (venueId) {
    const { data: venueData } = await supabase
      .from('venues')
      .select('name')
      .eq('id', venueId)
      .single()

    const typedVenueData = venueData as { name: string } | null
    if (typedVenueData) {
      venueName = typedVenueData.name
    }
  }

  if (userId) {
    const { data: userData } = await supabase
      .from('users')
      .select('nickname')
      .eq('id', userId)
      .single()

    const typedUserData = userData as { nickname: string } | null
    if (typedUserData) {
      userName = typedUserData.nickname
    }
  }

  // 会場別人数を取得
  const venues = (await getVenueCounts()) as VenueWithCount[]

  return (
    <div className="space-y-6">
      {/* タイトル */}
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-8 glow-text tracking-wider">
          HYPER CHILL
        </h1>
      </div>

      {/* チェックイン完了メッセージ */}
      <div className="dark-card rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-4 glow-text">
          チェックイン完了！
        </h2>
        {userName && (
          <p className="text-xl text-gray-300 mb-4">
            {userName}さん、ようこそ！
          </p>
        )}
        <p className="text-gray-400 mb-6">
          {venueName}にチェックインしました
        </p>

        <div className="glass-effect rounded-lg p-4">
          <p className="text-sm text-gray-300">
            別の会場に移動する際は、その会場のQRコードを読み取ってください。
            自動的に現在地が更新されます。
          </p>
        </div>
      </div>

      {/* 会場別人数表示 */}
      <div className="dark-card rounded-lg p-6">
        <RealtimeCounter initialVenues={venues} darkMode={true} />
      </div>

      {/* 写真アップロードフォーム */}
      <PhotoUploadForm />
    </div>
  )
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ venue?: string }>
}) {
  const params = await searchParams
  const venueId = params.venue || null

  return (
    <>
      <AnimatedBackground />
      <main className="min-h-screen py-8 px-4 relative z-10">
        <div className="max-w-2xl mx-auto">
          <Suspense
            fallback={
              <div className="dark-card rounded-lg p-8 text-center">
                <div className="text-4xl mb-4">⏳</div>
                <p className="text-gray-400">読み込み中...</p>
              </div>
            }
          >
            <SuccessContent venueId={venueId} />
          </Suspense>
        </div>
      </main>
    </>
  )
}

