import { getVisitLogs } from '@/actions/admin'
import { LogTimeline } from '@/components/admin/LogTimeline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { VisitLogWithDetails } from '@/types/database'

export const dynamic = 'force-dynamic'

export default async function LogsPage() {
  const logs = (await getVisitLogs(200)) as VisitLogWithDetails[]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>移動ログ（時系列）</CardTitle>
        </CardHeader>
        <CardContent>
          <LogTimeline logs={logs} />
        </CardContent>
      </Card>
    </div>
  )
}

