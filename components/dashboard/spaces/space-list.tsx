"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon, FileTextIcon, StarIcon, Trash2Icon } from "lucide-react"
import { toast } from "sonner"


import type { Space } from "@/types/spaces"
import { deleteSpace } from "@/actions/dashboard/space/space"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"

interface SpacesListProps {
  initialSpaces: Space[]
}

export function SpacesList({ initialSpaces }: SpacesListProps) {
  const router = useRouter()
  const [spaces, setSpaces] = useState<Space[]>(initialSpaces)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDeleteSpace = async (spaceId: string) => {
    try {
      setIsDeleting(spaceId)
      await deleteSpace(spaceId)
      setSpaces(spaces.filter((space) => space.id !== spaceId))
      toast.success("Space deleted successfully")
      router.refresh()
    } catch (error) {
      toast.error("Failed to delete space")
      console.error(error)
    } finally {
      setIsDeleting(null)
    }
  }

  const handleSpaceClick = (spaceId: string) => {
    router.push(`/dashboard/spaces/${spaceId}`)
  }

  if (spaces.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <h3 className="mb-2 text-lg font-semibold">No spaces found</h3>
        <p className="mb-6 text-sm text-muted-foreground">
          Create your first space to start collecting reviews for your product.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 px-4 sm:grid-cols-2 lg:grid-cols-3 lg:px-6">
      {spaces.map((space) => (
        <Card key={space.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span className="truncate">{space.name}</span>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Trash2Icon className="h-4 w-4" />
                    <span className="sr-only">Delete space</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the space "{space.name}" and all its forms and reviews. This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeleteSpace(space.id)} disabled={isDeleting === space.id}>
                      {isDeleting === space.id ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardTitle>
            <CardDescription className="line-clamp-2">{space.description || "No description provided"}</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <FileTextIcon className="h-3 w-3" />
                {space.formCount} {space.formCount === 1 ? "form" : "forms"}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <StarIcon className="h-3 w-3" />
                {space.reviewCount} {space.reviewCount === 1 ? "review" : "reviews"}
              </Badge>
              {space.averageRating > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <StarIcon className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                  {space.averageRating.toFixed(1)}
                </Badge>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start pt-2">
            <div className="flex items-center text-xs text-muted-foreground">
              <CalendarIcon className="mr-1 h-3 w-3" />
              Created {new Date(space.createdAt).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })}
            </div>
            <Button variant="default" className="mt-4 w-full" onClick={() => handleSpaceClick(space.id)}>
              View Space
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

