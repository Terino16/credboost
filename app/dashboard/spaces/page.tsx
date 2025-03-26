import { Suspense } from "react"
import { SpacesList } from "@/components/dashboard/spaces/space-list"
import { SpacesLoading } from "@/components/dashboard/spaces/space-loading"
import { getSpaces } from "@/actions/dashboard/space/space"
import { SpaceHeader } from "@/components/dashboard/spaces/space-header"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { CreateSpaceDialog } from "@/components/dashboard/spaces/create-space-dialog"

export const metadata = {
  title: "Spaces | CredBoost",
  description: "Manage your product spaces and review forms",
}

export default async function SpacesPage() {
  try {
    const spaces = await getSpaces()

    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-6">
          <h1 className="text-2xl font-semibold">Spaces</h1>

          <CreateSpaceDialog>
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              New Space
            </Button>
          </CreateSpaceDialog>
        </div>
      
        <Suspense fallback={<SpacesLoading />}>
          <SpacesList initialSpaces={spaces} />
        </Suspense>
      </div>
    )
  } catch (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8">
        <h2 className="text-lg font-semibold">Failed to load spaces</h2>
        <p className="text-sm text-muted-foreground">
          {error instanceof Error ? error.message : "Please try again later"}
        </p>
      </div>
    )
  }
}

