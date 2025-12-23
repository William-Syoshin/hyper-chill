import { getVenuePeakTimes, getStatistics } from '@/actions/analytics'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  const peaks = await getVenuePeakTimes()
  const stats = await getStatistics()

  return (
    <div className="space-y-6">
      {/* 統計サマリー */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">総来場者数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {stats.totalUsers}
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
              {stats.totalCheckins}
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
              {stats.approvedPhotos}
            </div>
            <p className="text-xs text-gray-600 mt-1">枚</p>
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

      {/* 会場別ピーク時間 */}
      <Card>
        <CardHeader>
          <CardTitle>会場別ピーク時間</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {peaks.map((peak) => {
              const color =
                peak.venue_id === 'A'
                  ? 'border-red-500 bg-red-50'
                  : peak.venue_id === 'B'
                    ? 'border-green-500 bg-green-50'
                    : 'border-blue-500 bg-blue-50'

              return (
                <div
                  key={peak.venue_id}
                  className={`${color} border-2 rounded-lg p-6`}
                >
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900 mb-2">
                      会場{peak.venue_id}
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {peak.peak_count}人
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                      {peak.peak_time || '未測定'}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* 分析情報 */}
      <Card>
        <CardHeader>
          <CardTitle>データ分析</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">
                📊 来場者の流れ
              </h3>
              <p className="text-sm text-gray-700">
                平均移動回数:{' '}
                {stats.totalUsers > 0
                  ? (stats.totalCheckins / stats.totalUsers).toFixed(1)
                  : '0'}
                回/人
              </p>
              <p className="text-sm text-gray-700 mt-1">
                来場者は平均して
                {stats.totalUsers > 0
                  ? Math.floor(stats.totalCheckins / stats.totalUsers)
                  : 0}
                箇所の会場を訪問しています。
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">
                📷 写真投稿状況
              </h3>
              <p className="text-sm text-gray-700">
                総写真数: {stats.totalPhotos}枚（承認済み:{' '}
                {stats.approvedPhotos}枚）
              </p>
              <p className="text-sm text-gray-700 mt-1">
                承認率:{' '}
                {stats.totalPhotos > 0
                  ? ((stats.approvedPhotos / stats.totalPhotos) * 100).toFixed(
                      1
                    )
                  : 0}
                %
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-900 mb-2">
                💡 推奨アクション
              </h3>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                {stats.approvedPhotos < stats.totalPhotos && (
                  <li>
                    未承認の写真が{stats.totalPhotos - stats.approvedPhotos}
                    枚あります。写真管理ページで確認してください。
                  </li>
                )}
                {stats.totalUsers > 0 &&
                  stats.totalCheckins / stats.totalUsers < 1.5 && (
                    <li>
                      会場間の移動が少ない傾向があります。回遊を促す施策を検討してください。
                    </li>
                  )}
                {stats.totalUsers === 0 && (
                  <li>まだ来場者がいません。イベントの開始をお待ちください。</li>
                )}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

