import { Space } from "@/types/spaces"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface SpaceContentProps {
  space: Space
}

export function SpaceContent({ space }: SpaceContentProps) {
  return (
    <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Forms</CardTitle>
          <CardDescription>Total forms created</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{space.formCount}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
          <CardDescription>Total reviews received</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{space.reviewCount}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Average Rating</CardTitle>
          <CardDescription>Overall product rating</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{space.averageRating.toFixed(1)}</p>
        </CardContent>
      </Card>
    </div>
  )
} 