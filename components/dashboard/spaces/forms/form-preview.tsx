"use client"

import type React from "react"

import { useState } from "react"
import { StarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface FormPreviewProps {
  formData: any
}

export function FormPreview({ formData }: FormPreviewProps) {
  const [currentStep, setCurrentStep] = useState<"form" | "thankyou">("form")
  const [rating, setRating] = useState<number | null>(null)
  const [hoveredRating, setHoveredRating] = useState<number | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentStep("thankyou")
  }

  if (currentStep === "thankyou") {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Thank You!</CardTitle>
          <CardDescription>{formData.thankYouMessage}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          {formData.offerDiscount && formData.discountCode && (
            <div className="mx-auto max-w-xs rounded-lg border border-dashed p-4">
              <h3 className="mb-2 text-lg font-medium">Your Discount Code</h3>
              <div className="mb-2 rounded-md bg-muted p-3 text-xl font-bold tracking-wider">
                {formData.discountCode}
              </div>
              <p className="text-sm text-muted-foreground">
                {formData.discountValue || "Use this code for your next purchase"}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="outline" onClick={() => setCurrentStep("form")}>
            Back to Form
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <div className="mb-4 flex justify-center">
          {formData.logoUrl ? (
            <img
              src={formData.logoUrl || "/placeholder.svg"}
              alt="Product logo"
              className="h-16 w-auto object-contain"
            />
          ) : (
            <div className="flex h-16 w-32 items-center justify-center rounded-md border border-dashed">
              <span className="text-sm text-muted-foreground">Logo Preview</span>
            </div>
          )}
        </div>
        <CardTitle>{formData.title}</CardTitle>
        <CardDescription>{formData.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {formData.requireAuthentication && (
            <div className="space-y-2">
              <Label htmlFor="email">Your Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" required />
              <p className="text-xs text-muted-foreground">
                We'll send a verification code to this email before submitting your feedback.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input id="name" placeholder="Enter your name" required />
          </div>

          <div className="space-y-2">
            <Label>
              How would you rate your overall experience?
              <span className="ml-1 text-destructive">*</span>
            </Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="flex flex-col items-center"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(null)}
                >
                  <StarIcon
                    className={`h-8 w-8 ${
                      (hoveredRating !== null ? star <= hoveredRating : star <= (rating || 0))
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-muted-foreground"
                    }`}
                  />
                  <span className="text-xs">{star}</span>
                </button>
              ))}
            </div>
          </div>

          {formData.questions.map((question: any, index: number) => (
            <div key={index} className="space-y-2">
              <Label htmlFor={`question-${index}`}>
                {question.text}
                {question.required && <span className="ml-1 text-destructive">*</span>}
              </Label>

              {question.type === "text" && (
                <Input id={`question-${index}`} placeholder="Your answer" required={question.required} />
              )}

              {question.type === "textarea" && (
                <Textarea id={`question-${index}`} placeholder="Your answer" required={question.required} />
              )}

              {question.type === "radio" && (
                <RadioGroup defaultValue="option-1">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option-1" id={`option-1-${index}`} />
                    <Label htmlFor={`option-1-${index}`}>Option 1</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option-2" id={`option-2-${index}`} />
                    <Label htmlFor={`option-2-${index}`}>Option 2</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option-3" id={`option-3-${index}`} />
                    <Label htmlFor={`option-3-${index}`}>Option 3</Label>
                  </div>
                </RadioGroup>
              )}

              {question.type === "checkbox" && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id={`checkbox-1-${index}`} />
                    <Label htmlFor={`checkbox-1-${index}`}>Option 1</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id={`checkbox-2-${index}`} />
                    <Label htmlFor={`checkbox-2-${index}`}>Option 2</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id={`checkbox-3-${index}`} />
                    <Label htmlFor={`checkbox-3-${index}`}>Option 3</Label>
                  </div>
                </div>
              )}
            </div>
          ))}

          <div className="pt-4">
            <Button type="submit" className="w-full">
              Submit Feedback
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

