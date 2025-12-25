import { redirect } from 'next/navigation'
import { validateVenueId } from '@/lib/validation'
import { VENUE_IDS, ENTRANCE_VENUE_ID } from '@/lib/constants'
import { RegisterForm } from '@/components/forms/RegisterForm'
import { SimpleCheckinForm } from '@/components/forms/SimpleCheckinForm'
import { createClient } from '@/lib/supabase/server'
import { getUserIdFromServer } from '@/lib/cookie'

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

  // ユーザーIDを取得
  const userId = await getUserIdFromServer()
  
  // 事前登録済みかチェック
  let showSimpleCheckin = false
  let userNickname = ''
  
  if (userId) {
    // ユーザー情報を取得
    const { data: userData } = await supabase
      .from('users')
      .select('nickname')
      .eq('id', userId)
      .single()
    
    if (userData) {
      userNickname = (userData as { nickname: string }).nickname
      
      // 最初の visit_log を取得して事前登録かチェック
      const { data: firstLog } = await supabase
        .from('visit_logs')
        .select('venue_id')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })
        .limit(1)
        .single()
      
      const typedFirstLog = firstLog as { venue_id: string } | null
      
      // 最初の visit_log が 'entrance' なら事前登録済み
      if (typedFirstLog && typedFirstLog.venue_id === ENTRANCE_VENUE_ID) {
        showSimpleCheckin = true
      }
    }
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* タイトル */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 glow-text tracking-wider">
            HYPER CHILL
          </h1>
        </div>

        <div className="dark-card rounded-lg p-6">
          {showSimpleCheckin && userId ? (
            <SimpleCheckinForm 
              venueId={venue} 
              venueName={venueName}
              userId={userId}
              userNickname={userNickname}
            />
          ) : (
            <RegisterForm venueId={venue} venueName={venueName} />
          )}
        </div>
      </div>
    </main>
  )
}

