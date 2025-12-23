import { redirect } from 'next/navigation'
import { validateVenueId } from '@/lib/validation'
import { VENUE_IDS } from '@/lib/constants'
import { RegisterForm } from '@/components/forms/RegisterForm'
import { createClient } from '@/lib/supabase/server'
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

export default async function RegisterPage({ params }: PageProps) {
  const { venue } = await params

  // 会場IDのバリデーション
  if (!validateVenueId(venue)) {
    redirect('/')
  }

  // 会場情報を取得
  const supabase = await createClient()
  const { data: venueData } = await supabase
    .from('venues')
    .select('*')
    .eq('id', venue)
    .single()

  const typedVenueData = venueData as { id: string; name: string } | null
  const venueName = typedVenueData?.name || `会場${venue}`

  return (
    <>
      <AnimatedBackground />
      <main className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <div className="max-w-md w-full">
          {/* タイトル */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white mb-2 glow-text tracking-wider">
              HYPER CHILL
            </h1>
          </div>

          <div className="dark-card rounded-lg p-6">
            <RegisterForm venueId={venue} venueName={venueName} />
          </div>
        </div>
      </main>
    </>
  )
}

