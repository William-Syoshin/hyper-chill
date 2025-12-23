import { getVisitors } from '@/actions/admin'
import { VisitorList } from '@/components/admin/VisitorList'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export const dynamic = 'force-dynamic'

export default async function VisitorsPage() {
  const visitors = await getVisitors()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>来場者一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <VisitorList visitors={visitors} />
        </CardContent>
      </Card>
    </div>
  )
}

