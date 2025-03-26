"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { ArrowLeftIcon, CheckIcon, EyeIcon, ImageIcon, PlusIcon, SaveIcon, Trash2Icon } from "lucide-react"

import type { Space } from "@/types/spaces"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { FormPreview } from "@/components/dashboard/spaces/forms/form-preview"
import { createForm } from "@/actions/dashboard/forms/form"

const questionSchema = z.object({
  id: z.string(),
  text: z.string().min(3, "Question must be at least 3 characters").max(200, "Question must not exceed 200 characters"),
  required: z.boolean().default(false),
  type: z.enum(["text", "textarea", "radio", "checkbox"]).default("text"),
  options: z.array(z.string()).optional(),
})

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must not exceed 100 characters"),
  description: z.string().max(500, "Description must not exceed 500 characters").optional(),
  logoUrl: z.string().optional(),
  requireAuthentication: z.boolean().default(false),
  offerDiscount: z.boolean().default(false),
  discountCode: z.string().optional(),
  discountValue: z.string().optional(),
  thankYouMessage: z
    .string()
    .min(3, "Thank you message is required")
    .max(500, "Thank you message must not exceed 500 characters"),
  questions: z.array(questionSchema).min(1, "At least one question is required").max(5, "Maximum 5 questions allowed"),
})

type FormValues = z.infer<typeof formSchema>

interface FormBuilderProps {
  space: Space
}

export function FormBuilder({ space }: FormBuilderProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("build")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: `${space.name} Feedback Form`,
      description: `We value your feedback about ${space.name}. Please take a moment to share your experience.`,
      logoUrl: "",
      requireAuthentication: false,
      offerDiscount: false,
      discountCode: "",
      discountValue: "",
      thankYouMessage: "Thank you for your feedback! Your input helps us improve our products and services.",
      questions: [
        {
          id: crypto.randomUUID(),
          text: "How would you rate your overall experience?",
          required: true,
          type: "text",
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "questions",
  })

  const watchOfferDiscount = form.watch("offerDiscount")
  const watchAllFields = form.watch()

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you would upload this to a storage service
      // For now, we'll just create a local URL for preview
      const url = URL.createObjectURL(file)
      setLogoPreview(url)
      form.setValue("logoUrl", url)
    }
  }

  const addQuestion = () => {
    if (fields.length >= 5) {
      toast.error("Maximum 5 questions allowed")
      return
    }

    append({
      id: crypto.randomUUID(),
      text: "",
      required: false,
      type: "text",
    })
  }

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true)
    try {
      const result = await createForm({
        ...values,
        spaceId: space.id
      })

      if (!result.success) {
        toast.error(result.error || "Failed to create form")
        return
      }

      toast.success("Form created successfully")
      router.push(`/dashboard/spaces/${space.id}`)
    } catch (error) {
      console.error("Error creating form:", error)
      toast.error("Failed to create form")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/dashboard/spaces/${space.id}`}>
              <ArrowLeftIcon className="h-4 w-4" />
              <span className="sr-only">Back to space</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Create Form</h1>
            <p className="text-sm text-muted-foreground">Build a custom review form for {space.name}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setActiveTab("preview")} className="mt-2 sm:mt-0">
            <EyeIcon className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button size="sm" onClick={form.handleSubmit(handleSubmit)} disabled={isSubmitting} className="mt-2 sm:mt-0">
            <SaveIcon className="mr-2 h-4 w-4" />
            {isSubmitting ? "Saving..." : "Save Form"}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="build">Build Form</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="build" className="mt-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Form Details</CardTitle>
              <CardDescription>Basic information about your review form</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Form Title</Label>
                <Input id="title" {...form.register("title")} placeholder="Enter form title" />
                {form.formState.errors.title && (
                  <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  {...form.register("description")}
                  placeholder="Enter a brief description of your form"
                  rows={3}
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Product Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="flex h-24 w-24 items-center justify-center rounded-md border border-dashed">
                    {logoPreview ? (
                      <img
                        src={logoPreview || "/placeholder.svg"}
                        alt="Logo preview"
                        className="h-full w-full object-contain p-2"
                      />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="w-full max-w-sm"
                    />
                    <p className="text-xs text-muted-foreground">Upload your product logo (max 2MB, PNG or JPG)</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Questions</CardTitle>
              <CardDescription>
                Add up to 5 questions to your form. A star rating question is automatically included.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-md border p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Star Rating (Required)</h3>
                  <div className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Always included</span>
                  </div>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  How would you rate your overall experience with our product?
                </p>
                <div className="mt-2 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div key={star} className="flex flex-col items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-6 w-6 text-muted-foreground"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-xs">{star}</span>
                    </div>
                  ))}
                </div>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="rounded-md border p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-medium">Question {index + 1}</h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="h-8 w-8 text-destructive"
                    >
                      <Trash2Icon className="h-4 w-4" />
                      <span className="sr-only">Remove question</span>
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`questions.${index}.text`}>Question Text</Label>
                      <Input
                        id={`questions.${index}.text`}
                        {...form.register(`questions.${index}.text`)}
                        placeholder="Enter your question"
                      />
                      {form.formState.errors.questions?.[index]?.text && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.questions[index]?.text?.message}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`questions.${index}.required`}
                        checked={form.watch(`questions.${index}.required`)}
                        onCheckedChange={(checked) => form.setValue(`questions.${index}.required`, checked)}
                      />
                      <Label htmlFor={`questions.${index}.required`}>Required question</Label>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`questions.${index}.type`}>Question Type</Label>
                      <select
                        id={`questions.${index}.type`}
                        {...form.register(`questions.${index}.type`)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="text">Short Text</option>
                        <option value="textarea">Long Text</option>
                        <option value="radio">Single Choice</option>
                        <option value="checkbox">Multiple Choice</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addQuestion}
                disabled={fields.length >= 5}
                className="w-full"
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Question {fields.length >= 5 && "(Maximum 5)"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Form Settings</CardTitle>
              <CardDescription>Configure additional settings for your form</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label htmlFor="requireAuthentication">Require Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Require users to verify their email before submitting the form
                  </p>
                </div>
                <Switch
                  id="requireAuthentication"
                  checked={form.watch("requireAuthentication")}
                  onCheckedChange={(checked) => form.setValue("requireAuthentication", checked)}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="offerDiscount">Offer Discount</Label>
                    <p className="text-sm text-muted-foreground">Provide a discount code on the thank you page</p>
                  </div>
                  <Switch
                    id="offerDiscount"
                    checked={form.watch("offerDiscount")}
                    onCheckedChange={(checked) => form.setValue("offerDiscount", checked)}
                  />
                </div>

                {watchOfferDiscount && (
                  <div className="ml-6 space-y-4 rounded-md border p-4">
                    <div className="space-y-2">
                      <Label htmlFor="discountCode">Discount Code</Label>
                      <Input id="discountCode" {...form.register("discountCode")} placeholder="e.g., THANKYOU10" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="discountValue">Discount Value</Label>
                      <Input id="discountValue" {...form.register("discountValue")} placeholder="e.g., 10% OFF" />
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="thankYouMessage">Thank You Message</Label>
                <Textarea
                  id="thankYouMessage"
                  {...form.register("thankYouMessage")}
                  placeholder="Enter a thank you message to display after form submission"
                  rows={3}
                />
                {form.formState.errors.thankYouMessage && (
                  <p className="text-sm text-destructive">{form.formState.errors.thankYouMessage.message}</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.push(`/dashboard/spaces/${space.id}`)}>
                Cancel
              </Button>
              <Button onClick={form.handleSubmit(handleSubmit)} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Form"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="mt-4">
          <FormPreview formData={watchAllFields} />
          <div className="mt-4 flex justify-end">
            <Button onClick={() => setActiveTab("build")}>
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to Editor
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

