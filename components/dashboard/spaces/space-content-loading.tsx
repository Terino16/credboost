import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function SpaceContentLoading() {
  return (
    <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-5 w-[120px]" />
            <Skeleton className="h-4 w-[180px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-[60px]" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 