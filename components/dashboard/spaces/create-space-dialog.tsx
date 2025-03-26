"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"

import { createSpace, getUserSubscription } from "@/actions/dashboard/space/space"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Space name must be at least 2 characters.",
    })
    .max(50, {
      message: "Space name must not exceed 50 characters.",
    }),
  description: z
    .string()
    .max(200, {
      message: "Description must not exceed 200 characters.",
    })
    .optional(),
})

interface CreateSpaceDialogProps {
  children: React.ReactNode
}

export function CreateSpaceDialog({ children }: CreateSpaceDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [subscription, setSubscription] = useState<{
    plan: string
    spacesLimit: number
    currentSpaces: number
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  const onOpenChange = async (open: boolean) => {
    setOpen(open)

    if (open && !subscription) {
      setIsLoading(true)
      try {
        const sub = await getUserSubscription()
        setSubscription({
          plan: sub.plan,
          spacesLimit: sub.spacesLimit,
          currentSpaces: sub.currentSpaces
        })
      } catch (error) {
        console.error("Failed to load subscription data", error)
        toast.error("Failed to load subscription data")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (subscription && subscription.currentSpaces >= subscription.spacesLimit) {
      toast.error("Space limit reached", {
        description: `Your plan allows ${subscription.spacesLimit} spaces. Please upgrade to create more spaces.`,
        action: {
          label: "Upgrade",
          onClick: () => router.push("/dashboard/billing"),
        },
        duration: 5000,
      })
      return
    }

    setIsCreating(true)
    try {
      await createSpace(values)
      toast.success("Space created successfully")
      router.refresh()
      setOpen(false)
      form.reset()
      
      if (subscription) {
        setSubscription({
          ...subscription,
          currentSpaces: subscription.currentSpaces + 1
        })
      }
    } catch (error) {
      console.error("Failed to create space", error)
      toast.error("Failed to create space", {
        description: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new space</DialogTitle>
          <DialogDescription>Create a space for your product to collect and manage reviews.</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            <span className="ml-2">Loading subscription data...</span>
          </div>
        ) : (
          <>
            {subscription && (
              <div className="mb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Your plan: <span className="font-medium capitalize">{subscription.plan}</span>
                  </p>
                  <Button 
                    variant="link" 
                    className="h-auto p-0 text-sm"
                    onClick={() => router.push("/dashboard/billing")}
                  >
                    Upgrade
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Spaces used: <span className="font-medium">{subscription.currentSpaces} of {subscription.spacesLimit}</span>
                  </p>
                </div>
              </div>
            )}

            {subscription && subscription.currentSpaces >= subscription.spacesLimit && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Space limit reached</AlertTitle>
                <AlertDescription>
                  You've reached your limit of {subscription.spacesLimit} spaces. Please upgrade your plan to create more spaces.
                </AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Product name" {...field} />
                      </FormControl>
                      <FormDescription>This is the name of your product or service.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Brief description of your product" className="resize-none" {...field} />
                      </FormControl>
                      <FormDescription>A short description to help you identify this space.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button 
                    type="submit" 
                    disabled={isCreating}
                  >
                    {isCreating ? "Creating..." : "Create Space"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

