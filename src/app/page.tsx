import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* タイトル */}
        <div className="text-center mb-16">
          <h1 className="text-7xl font-bold text-gray-900 mb-6 tracking-wider">
            HYPER CHILL
          </h1>
          <p className="text-gray-600 text-xl tracking-widest">
            EVENT CHECK-IN SYSTEM
          </p>
        </div>

        {/* 事前登録リンク */}
        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-8 mb-6">
          <p className="text-lg font-bold text-blue-800 mb-2 text-center">
            事前登録はこちら
          </p>
          <p className="text-sm text-gray-600 mb-4 text-center">
            イベント当日の受付をスムーズに
          </p>
          <div className="text-center">
            <Link
              href="/pre-register"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition tracking-wider"
            >
              事前登録する
            </Link>
          </div>
        </div>

        {/* 開発用リンク */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 mb-6">
          <p className="text-sm font-semibold text-yellow-600 mb-4 text-center">
            開発/テスト用リンク
          </p>
          <div className="flex justify-center gap-6 text-lg">
            <Link
              href="/checkin/homeplanet"
              className="font-medium hover:opacity-70 transition tracking-wider"
              style={{ color: "#8b5555" }}
            >
              EOS BASEMENT
            </Link>
            <span className="text-gray-400">|</span>
            <Link
              href="/checkin/movement"
              className="font-medium hover:opacity-70 transition tracking-wider"
              style={{ color: "#558b55" }}
            >
              MOVEMENT
            </Link>
            <span className="text-gray-400">|</span>
            <Link
              href="/checkin/astro"
              className="font-medium hover:opacity-70 transition tracking-wider"
              style={{ color: "#55658b" }}
            >
              ASTRO
            </Link>
          </div>
        </div>

        {/* 管理者リンク */}
        <div className="text-center">
          <Link
            href="/admin"
            className="text-sm text-gray-500 hover:text-gray-700 transition inline-block"
          >
            管理者の方はこちら →
          </Link>
        </div>
      </div>
    </main>
  );
}
