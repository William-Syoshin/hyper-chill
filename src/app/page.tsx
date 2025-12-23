import Link from 'next/link'
import { AnimatedBackground } from '@/components/AnimatedBackground'

export default function Home() {
  return (
    <>
      <AnimatedBackground />
      <main className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <div className="max-w-2xl w-full">
          {/* タイトル */}
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold text-white mb-4 glow-text tracking-wider">
              HYPER CHILL
            </h1>
            <p className="text-gray-400 text-lg tracking-widest">
              EVENT CHECK-IN SYSTEM
            </p>
          </div>

          {/* メインカード */}
          <div className="dark-card rounded-lg p-8 mb-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">ご来場の方へ</h2>
              <p className="text-gray-400">
                各会場に設置されているQRコードを読み取ってチェックインしてください。
              </p>
            </div>

            <div className="space-y-4">
              {/* チェックイン方法 */}
              <div className="glass-effect rounded-lg p-5">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="text-xl">📱</span>
                  チェックイン方法
                </h3>
                <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
                  <li>会場のQRコードをスマートフォンで読み取る</li>
                  <li>初回の方は写真とニックネームを登録（2回目以降は不要）</li>
                  <li>自動的にチェックイン完了！</li>
                </ol>
              </div>

              {/* 会場間移動 */}
              <div className="glass-effect rounded-lg p-5">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="text-xl">✨</span>
                  会場間の移動について
                </h3>
                <p className="text-sm text-gray-300">
                  別の会場に移動する際は、その会場のQRコードを読み取るだけでOK！
                  自動的に現在地が更新されます。
                </p>
              </div>
            </div>

            {/* 管理者リンク */}
            <div className="mt-6 pt-6 border-t border-gray-800">
              <Link
                href="/admin"
                className="text-sm text-gray-500 hover:text-gray-300 transition"
              >
                管理者の方はこちら →
              </Link>
            </div>
          </div>

          {/* デモ用リンク */}
          <div className="dark-card rounded-lg p-4 border-yellow-500/20">
            <p className="text-sm font-semibold text-yellow-500 mb-2">
              開発/テスト用リンク
            </p>
            <div className="flex gap-3 text-sm">
              <Link
                href="/checkin/homeplanet"
                className="hover:opacity-80 transition"
                style={{ color: '#8b5555' }}
              >
                HOME PLANET
              </Link>
              <span className="text-gray-600">|</span>
              <Link
                href="/checkin/movement"
                className="hover:opacity-80 transition"
                style={{ color: '#558b55' }}
              >
                MOVEMENT
              </Link>
              <span className="text-gray-600">|</span>
              <Link
                href="/checkin/astro"
                className="hover:opacity-80 transition"
                style={{ color: '#55658b' }}
              >
                ASTRO
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

