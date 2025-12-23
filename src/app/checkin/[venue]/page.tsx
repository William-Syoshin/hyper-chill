import { redirect } from 'next/navigation'
import { checkIn } from '@/actions/checkin'
import { validateVenueId } from '@/lib/validation'
import { VENUE_IDS } from '@/lib/constants'
import { AnimatedBackground } from '@/components/AnimatedBackground'

interface PageProps {
  params: Promise<{
    venue: string
  }>
}

export async function generateStaticParams() {
  return VENUE_IDS.map((venue) => ({
    venue,
  }))
}

export default async function CheckinPage({ params }: PageProps) {
  const { venue } = await params

  // 会場IDのバリデーション
  if (!validateVenueId(venue)) {
    redirect('/')
  }

  // チェックイン処理を実行
  const result = await checkIn(venue)

  // 初回来場の場合は登録ページへ
  if (result.needsRegistration) {
    redirect(`/register/${venue}`)
  }

  // エラーの場合
  if (!result.success) {
    return (
      <>
        <AnimatedBackground />
        <main className="min-h-screen flex items-center justify-center p-4 relative z-10">
          <div className="max-w-md w-full dark-card rounded-lg p-8">
            <div className="text-center">
              <div className="text-6xl mb-4">❌</div>
              <h1 className="text-2xl font-bold text-white mb-2 glow-text">
                エラーが発生しました
              </h1>
              <p className="text-gray-400 mb-6">{result.error}</p>
              <a
                href="/"
                className="inline-block px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition border border-white/20"
              >
                トップページへ
              </a>
            </div>
          </div>
        </main>
      </>
    )
  }

  // 成功の場合はsuccessページへ
  redirect(`/success?venue=${venue}`)
}

