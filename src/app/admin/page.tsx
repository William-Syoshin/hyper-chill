import { getVenueCounts } from '@/actions/admin'
import { getStatistics } from '@/actions/analytics'
import { RealtimeCounter } from '@/components/admin/RealtimeCounter'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { VenueWithCount } from '@/types/database'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const venues = (await getVenueCounts()) as VenueWithCount[]
  const stats = await getStatistics()

  return (
    <div className="space-y-8">
      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">総来場者数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {String(stats.totalUsers)}
            </div>
            <p className="text-xs text-gray-600 mt-1">人</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">総チェックイン数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {String(stats.totalCheckins)}
            </div>
            <p className="text-xs text-gray-600 mt-1">回</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">承認済み写真</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {String(stats.approvedPhotos)}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              / {String(stats.totalPhotos)}枚
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">平均移動回数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {stats.totalUsers > 0
                ? (stats.totalCheckins / stats.totalUsers).toFixed(1)
                : '0'}
            </div>
            <p className="text-xs text-gray-600 mt-1">回/人</p>
          </CardContent>
        </Card>
      </div>

      {/* リアルタイムカウンター */}
      <Card>
        <CardHeader>
          <CardTitle>会場別人数（リアルタイム）</CardTitle>
        </CardHeader>
        <CardContent>
          <RealtimeCounter initialVenues={venues} />
        </CardContent>
      </Card>

      {/* 使い方ガイド */}
      <Card>
        <CardHeader>
          <CardTitle>クイックガイド</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">
                📊 ダッシュボード
              </h3>
              <p className="text-sm text-gray-700">
                会場ごとの人数をリアルタイムで確認できます。7秒ごとに自動更新されます。
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">
                👥 来場者一覧
              </h3>
              <p className="text-sm text-gray-700">
                すべての来場者の情報と現在地を確認できます。ユーザーの削除も可能です。
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-900 mb-2">
                📝 移動ログ
              </h3>
              <p className="text-sm text-gray-700">
                すべてのチェックインログを時系列で確認できます。人の流れを把握できます。
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-900 mb-2">
                📷 写真管理
              </h3>
              <p className="text-sm text-gray-700">
                投稿された写真の承認/非承認を管理できます。マガジン制作に活用してください。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

