import { notFound } from "next/navigation"
import { getSpaces } from "@/actions/dashboard/space/space"
import { FormBuilder } from "@/components/dashboard/spaces/forms/form-builder"

interface NewFormPageProps {
  params: {
    id: Promise<string>
  }
}

export async function generateMetadata({ params }: NewFormPageProps) {
  const spaceId = await params.id
  const spaces = await getSpaces()
  const space = spaces.find((s) => s.id === spaceId)

  if (!space) {
    return {
      title: "Space Not Found",
    }
  }

  return {
    title: `New Form - ${space.name}`,
  }
}

export default async function NewFormPage({ params }: NewFormPageProps) {
  const spaceId = await params.id
  const spaces = await getSpaces()
  const space = spaces.find((s) => s.id === spaceId)

  if (!space) {
    notFound()
  }

  return <FormBuilder space={space} />
}

