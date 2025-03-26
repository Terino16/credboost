import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getSpace } from "@/actions/dashboard/space/space"
import { SpaceHeader } from "@/components/dashboard/spaces/space-header"
import { SpaceContentLoading } from "@/components/dashboard/spaces/space-content-loading"
import { SpaceDetail } from "@/components/dashboard/spaces/space-detail"
interface SpacePageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: SpacePageProps) {
  const {id} = await params

  const result = await getSpace(id)

  if (!result.success || !result.space) {
    return {
      title: "Space Not Found",
    }
  }

  return {
    title: `${result.space?.name} - Dashboard`,
    description: result.space?.description,
  }
}

export default async function SpacePage({ params }: SpacePageProps) {

  const {id} = await params
  const result = await getSpace(id)

  if (!result.success || !result.space) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={<SpaceContentLoading />}>
        <SpaceDetail space={result.space} />
      </Suspense>
    </div>
  )
}

