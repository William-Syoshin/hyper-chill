import Link from 'next/link'
import { AnimatedBackground } from '@/components/AnimatedBackground'

export default function Home() {
  return (
    <>
      <AnimatedBackground />
      <main className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <div className="max-w-2xl w-full">
          {/* タイトル */}
          <div className="text-center mb-16">
            <h1 className="text-7xl font-bold text-white mb-6 glow-text tracking-wider">
              HYPER CHILL
            </h1>
            <p className="text-gray-400 text-xl tracking-widest">
              EVENT CHECK-IN SYSTEM
            </p>
          </div>

          {/* 開発用リンク */}
          <div className="dark-card rounded-lg p-8 mb-6">
            <p className="text-sm font-semibold text-yellow-500 mb-4 text-center">
              開発/テスト用リンク
            </p>
            <div className="flex justify-center gap-6 text-lg">
              <Link
                href="/checkin/homeplanet"
                className="font-medium hover:opacity-80 transition tracking-wider"
                style={{ color: '#8b5555' }}
              >
                HOME PLANET
              </Link>
              <span className="text-gray-600">|</span>
              <Link
                href="/checkin/movement"
                className="font-medium hover:opacity-80 transition tracking-wider"
                style={{ color: '#558b55' }}
              >
                MOVEMENT
              </Link>
              <span className="text-gray-600">|</span>
              <Link
                href="/checkin/astro"
                className="font-medium hover:opacity-80 transition tracking-wider"
                style={{ color: '#55658b' }}
              >
                ASTRO
              </Link>
            </div>
          </div>

          {/* 管理者リンク */}
          <div className="text-center">
            <Link
              href="/admin"
              className="text-sm text-gray-500 hover:text-gray-300 transition inline-block"
            >
              管理者の方はこちら →
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}

