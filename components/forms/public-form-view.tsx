"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FormField } from "@/components/forms/form-field"
import { submitFormResponse } from "@/actions/forms/submit"
import { Form as FormType, QuestionType } from '@/types/forms'
import { toast } from "sonner"

interface PublicFormViewProps {
  form: FormType
}

export function PublicFormView({ form }: PublicFormViewProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Create dynamic form schema based on questions
  const formSchema = z.object({
    ...form.questions.reduce((acc: any, question) => {
      switch (question.type as QuestionType) {
        case 'checkbox':
          acc[question.id] = question.required 
            ? z.array(z.string()).min(1, "Please select at least one option")
            : z.array(z.string()).optional()
          break
        case 'rating':
          acc[question.id] = question.required
            ? z.number().min(1).max(5)
            : z.number().min(1).max(5).optional()
          break
        default:
          acc[question.id] = question.required 
            ? z.string().min(1, "This field is required") 
            : z.string().optional()
      }
      return acc
    }, {})
  })

  type FormValues = z.infer<typeof formSchema>

  const formInstance = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: form.questions.reduce((acc: any, question) => {
      switch (question.type as QuestionType) {
        case 'checkbox':
          acc[question.id] = []
          break
        case 'rating':
          acc[question.id] = 0
          break
        default:
          acc[question.id] = ''
      }
      return acc
    }, {})
  })

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)
    try {
      // Transform the values to include question text for better content
      const transformedValues = Object.entries(values).reduce((acc, [questionId, value]) => {
        const question = form.questions.find(q => q.id === questionId)
        if (question) {
          acc[questionId] = {
            value,
            questionText: question.text,
            type: question.type
          }
        }
        return acc
      }, {} as Record<string, { value: any; questionText: string; type: QuestionType }>)

      const result = await submitFormResponse(form.id, transformedValues)
      
      if (result.success) {
        setSubmitted(true)
        toast.success("Thank you for your feedback!")
      } else {
        toast.error(result.error || "Failed to submit form. Please try again.")
      }
    } catch (error) {
      console.error(error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Thank You!</CardTitle>
          <CardDescription>{form.thankYouMessage || "Thank you for submitting your feedback!"}</CardDescription>
        </CardHeader>
        {form.offerDiscount && form.discountCode && (
          <CardContent>
            <div className="rounded-lg border border-dashed p-6 text-center">
              <p className="text-lg font-semibold mb-2">Your Special Discount</p>
              <div className="bg-muted p-4 rounded-md">
                <p className="text-3xl font-bold tracking-wider">{form.discountCode}</p>
                {form.discountValue && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Save {form.discountValue}
                  </p>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Use this code at checkout to receive your discount
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    )
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        {form.logoUrl && (
          <div className="mb-4 flex justify-center">
            <img 
              src={form.logoUrl} 
              alt="Form Logo" 
              className="h-16 w-auto object-contain"
            />
          </div>
        )}
        <CardTitle>{form.title}</CardTitle>
        {form.description && (
          <CardDescription>{form.description}</CardDescription>
        )}
      </CardHeader>
      <Form {...formInstance}>
        <form onSubmit={formInstance.handleSubmit(onSubmit)} className="space-y-6">
          <CardContent className="space-y-6">
            {form.questions.map((question) => (
              <FormField
                key={question.id}
                question={question}
                form={formInstance}
              />
            ))}
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
} 