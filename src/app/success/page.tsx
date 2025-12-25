import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { getUserIdFromServer } from "@/lib/cookie";
import { PhotoUploadForm } from "@/components/forms/PhotoUploadForm";
import { RealtimeCounter } from "@/components/admin/RealtimeCounter";
import { PaymentSection } from "@/components/PaymentSection";
import { getVenueCounts } from "@/actions/admin";
import { VenueWithCount } from "@/types/database";
import { ENTRANCE_VENUE_ID } from "@/lib/constants";

async function SuccessContent({ venueId }: { venueId: string | null }) {
  const supabase = await createClient();
  const userId = await getUserIdFromServer();

  let venueName = venueId ? `会場${venueId}` : "会場";
  let userName = "";
  let ticketPaid = false;

  if (venueId) {
    const { data: venueData } = await supabase
      .from("venues")
      .select("name")
      .eq("id", venueId)
      .single();

    const typedVenueData = venueData as { name: string } | null;
    if (typedVenueData) {
      venueName = typedVenueData.name;
    }
  }

  if (userId) {
    const { data: userData } = await supabase
      .from("users")
      .select("nickname, ticket_paid")
      .eq("id", userId)
      .single();

    const typedUserData = userData as { nickname: string; ticket_paid: boolean } | null;
    if (typedUserData) {
      userName = typedUserData.nickname;
      ticketPaid = typedUserData.ticket_paid;
    }
  }

  // 会場別人数を取得
  const venues = (await getVenueCounts()) as VenueWithCount[];

  // 事前登録かどうかをチェック
  const isPreRegistration = venueId === ENTRANCE_VENUE_ID;

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
        {isPreRegistration ? (
          <>
            <h2 className="text-3xl font-bold text-white mb-4 glow-text">
              事前登録が完了しました！
            </h2>
            {userName && (
              <p className="text-xl text-gray-300 mb-6">
                {userName}さん、登録ありがとうございます！
              </p>
            )}
            <div className="glass-effect rounded-lg p-4">
              <p className="text-sm text-gray-300 mb-2">
                イベント当日、会場でQRコードをスキャンするだけで簡単にチェックインできます。
              </p>
              <p className="text-sm text-gray-400">
                当日お待ちしております！
              </p>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-white mb-4 glow-text">
              {venueName}にチェックインしました！
            </h2>
            {userName && (
              <p className="text-xl text-gray-300 mb-6">
                {userName}さん、ようこそ！
              </p>
            )}
            <div className="glass-effect rounded-lg p-4">
              <p className="text-sm text-gray-300">
                別の会場に移動する際は、その会場のQRコードを読み取ってください。
                自動的に現在地が更新されます。
              </p>
            </div>
          </>
        )}
      </div>

      {/* 会場別人数表示と地図 */}
      <div className="dark-card rounded-lg p-6">
        <RealtimeCounter initialVenues={venues} darkMode={true} />
      </div>

      {/* 写真アップロードフォーム */}
      <PhotoUploadForm />

      {/* 支払いセクション */}
      <PaymentSection userId={userId} initialPaid={ticketPaid} />
    </div>
  );
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ venue?: string }>;
}) {
  const params = await searchParams;
  const venueId = params.venue || null;

  return (
    <main className="min-h-screen bg-black py-8 px-4">
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
  );
}
