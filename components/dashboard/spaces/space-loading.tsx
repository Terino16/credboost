import { FileTextIcon, StarIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export function SpacesLoading() {
  // Create an array of 3 items to show loading state
  return (
    <div className="grid gap-4 px-4 sm:grid-cols-2 lg:grid-cols-3 lg:px-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-2/3" />
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <FileTextIcon className="h-3 w-3" />
                <Skeleton className="h-3 w-8" />
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <StarIcon className="h-3 w-3" />
                <Skeleton className="h-3 w-12" />
              </Badge>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start pt-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="mt-4 h-9 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

