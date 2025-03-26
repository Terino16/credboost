import { Space } from "@/types/spaces"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusIcon } from "lucide-react"

interface SpaceHeaderProps {
  spaces: Space[]
}

export function SpaceHeader({ spaces }: SpaceHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold">{spaces.length} Spaces</h1>
       
      </div>
      <Button asChild>
        <Link href={`/dashboard/spaces/${spaces[0].id}/forms/new`}>
          <PlusIcon className="mr-2 h-4 w-4" />
          New Space
        </Link>
      </Button>
    </div>
  )
}

