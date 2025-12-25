import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { getUserIdFromServer } from "@/lib/cookie";
import { PhotoUploadForm } from "@/components/forms/PhotoUploadForm";
import { RealtimeCounter } from "@/components/admin/RealtimeCounter";
import { PaymentSection } from "@/components/PaymentSection";
import { DiscordFeed } from "@/components/DiscordFeed";
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

      {/* Discordセクション */}
      <div className="dark-card rounded-lg p-6 border-2 border-indigo-500/30">
        <div className="text-center mb-4">
          <h3 className="text-2xl font-bold text-white mb-2 glow-text">
            💬 リアルタイムで来場者の会話をチェックしよう
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            AIが来場者の会話を要約してお届けします
          </p>
        </div>

        {/* Discord Feed - 最新5件のメッセージ */}
        <div className="mb-6">
          <DiscordFeed />
        </div>
        
        <div className="flex justify-center">
          <a
            href="https://discord.gg/Sx5YyAnTu"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-lg transition shadow-lg transform hover:scale-105"
          >
            <div className="flex items-center gap-3">
              <svg
                className="w-8 h-8"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              <span className="text-xl">Discordに参加</span>
            </div>
          </a>
        </div>
      </div>

      {/* 支払いセクション */}
      <PaymentSection userId={userId ?? null} initialPaid={ticketPaid} />
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
