"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GalleryVerticalEnd } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { saveOnboardingData } from "@/actions/onboarding"

type OnboardingData = {
  name: string
  age: string
  source: string
  spaceName: string
  spaceLogo: File | null
  spaceDescription: string
}

export function OnboardingForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<OnboardingData>({
    name: "",
    age: "",
    source: "",
    spaceName: "",
    spaceLogo: null,
    spaceDescription: "",
  })
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSourceChange = (value: string) => {
    setFormData((prev) => ({ ...prev, source: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFormData((prev) => ({ ...prev, spaceLogo: file }))

      // Create preview URL
      const fileUrl = URL.createObjectURL(file)
      setPreviewUrl(fileUrl)
    }
  }

  const handleNextStep = () => {
    setStep((prev) => prev + 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Handle logo upload first (you'll need to implement your own image upload solution)
    let logoUrl = null
    if (formData.spaceLogo) {
      // Upload the logo to your preferred storage solution (e.g., S3, Cloudinary)
      // logoUrl = await uploadLogo(formData.spaceLogo)
    }

    const result = await saveOnboardingData({
      ...formData,
      spaceLogo: logoUrl,
    })

    if (result.success) {
      setStep(3)
    } else {
      // Handle error - you might want to show an error message to the user
      console.error('Failed to save onboarding data')
    }
  }

  const goToDashboard = () => {
    router.push("/dashboard")
  }

  return (
    <div className={cn("w-full", className)} {...props}>
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between">
          <span className="text-sm font-medium">Step {step} of 3</span>
          <span className="text-sm text-muted-foreground">Onboarding</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }} />
        </div>
      </div>

      {step === 1 && (
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault()
            handleNextStep()
          }}
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Tell us about yourself</h1>
            <p className="text-balance text-sm text-muted-foreground">We need some basic information to get started</p>
          </div>

          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="25"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>How did you hear about us?</Label>
              <RadioGroup value={formData.source} onValueChange={handleSourceChange} className="grid gap-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="xreddit" id="xreddit" />
                  <Label htmlFor="xreddit" className="cursor-pointer">
                    XReddit
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="google" id="google" />
                  <Label htmlFor="google" className="cursor-pointer">
                    Google Search
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="user" id="user" />
                  <Label htmlFor="user" className="cursor-pointer">
                    Another User
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button type="submit" className="w-full" disabled={!formData.name || !formData.age || !formData.source}>
              Continue
            </Button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Create your space</h1>
            <p className="text-balance text-sm text-muted-foreground">
              Set up your workspace with a name, logo, and description
            </p>
          </div>

          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="spaceName">Space Name</Label>
              <Input
                id="spaceName"
                name="spaceName"
                value={formData.spaceName}
                onChange={handleInputChange}
                placeholder="My Awesome Space"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="spaceLogo">Space Logo</Label>
              <div className="flex flex-col items-center gap-4">
                {previewUrl ? (
                  <div className="relative h-24 w-24 overflow-hidden rounded-full border border-border">
                    <img
                      src={previewUrl || "/placeholder.svg"}
                      alt="Logo preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border border-dashed border-border bg-muted">
                    <GalleryVerticalEnd className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <div className="w-full">
                  <Input
                    id="spaceLogo"
                    name="spaceLogo"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="spaceDescription">Space Description</Label>
              <Textarea
                id="spaceDescription"
                name="spaceDescription"
                value={formData.spaceDescription}
                onChange={handleInputChange}
                placeholder="Describe your space in a few words..."
                rows={4}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={!formData.spaceName || !formData.spaceDescription}>
              Create Space
            </Button>
          </div>
        </form>
      )}

      {step === 3 && (
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Space Created Successfully!</h1>
            <p className="text-balance text-sm text-muted-foreground">
              Your space "{formData.spaceName}" has been created. You can now start using it.
            </p>
          </div>

          <Button onClick={goToDashboard} className="w-full max-w-xs">
            Go to Dashboard
          </Button>
        </div>
      )}
    </div>
  )
}

