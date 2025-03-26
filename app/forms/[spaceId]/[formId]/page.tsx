import { notFound } from "next/navigation"
import { getForm } from "@/actions/dashboard/forms/form"
import { PublicFormView } from "@/components/forms/public-form-view"

interface PublicFormPageProps {
  params: {
    spaceId: string
    formId: string
  }
}

export default async function PublicFormPage({ params }: PublicFormPageProps) {
  const { spaceId, formId } = params
  
  try {
    const result = await getForm(formId, spaceId)

    if (!result.success || !result.form) {
      notFound()
    }

    return <PublicFormView form={result.form} />
  } catch (error) {
    console.error('Error loading form:', error)
    notFound()
  }
} 