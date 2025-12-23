import { getPhotos } from '@/actions/admin'
import { PhotoGrid } from '@/components/admin/PhotoGrid'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { PhotoWithUser } from '@/types/database'

export const dynamic = 'force-dynamic'

export default async function PhotosPage() {
  const photos = (await getPhotos()) as PhotoWithUser[]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>写真管理</CardTitle>
        </CardHeader>
        <CardContent>
          <PhotoGrid photos={photos} />
        </CardContent>
      </Card>
    </div>
  )
}

