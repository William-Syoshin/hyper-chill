import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                管理者ダッシュボード
              </h1>
              <p className="text-sm text-gray-600">HyperSystem Admin</p>
            </div>
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              トップページへ →
            </Link>
          </div>
        </div>
      </header>

      {/* ナビゲーション */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            <Link
              href="/admin"
              className="py-4 px-1 border-b-2 border-transparent hover:border-blue-500 text-sm font-medium text-gray-600 hover:text-gray-900 whitespace-nowrap"
            >
              📊 ダッシュボード
            </Link>
            <Link
              href="/admin/visitors"
              className="py-4 px-1 border-b-2 border-transparent hover:border-blue-500 text-sm font-medium text-gray-600 hover:text-gray-900 whitespace-nowrap"
            >
              👥 来場者一覧
            </Link>
            <Link
              href="/admin/logs"
              className="py-4 px-1 border-b-2 border-transparent hover:border-blue-500 text-sm font-medium text-gray-600 hover:text-gray-900 whitespace-nowrap"
            >
              📝 移動ログ
            </Link>
            <Link
              href="/admin/photos"
              className="py-4 px-1 border-b-2 border-transparent hover:border-blue-500 text-sm font-medium text-gray-600 hover:text-gray-900 whitespace-nowrap"
            >
              📷 写真管理
            </Link>
            <Link
              href="/admin/analytics"
              className="py-4 px-1 border-b-2 border-transparent hover:border-blue-500 text-sm font-medium text-gray-600 hover:text-gray-900 whitespace-nowrap"
            >
              📈 分析
            </Link>
          </div>
        </div>
      </nav>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}

