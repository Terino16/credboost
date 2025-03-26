"use client"

import { Textarea } from "@/components/ui/textarea"

import { Input } from "@/components/ui/input"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeftIcon, FileTextIcon, PlusIcon, StarIcon, Copy, ExternalLink } from "lucide-react"
import type { Space } from "@/types/spaces"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface SpaceDetailProps {
  space: Space
}

export function SpaceDetail({ space }: SpaceDetailProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [spaceData, setSpaceData] = useState(space)
  
  console.log('Space data:', {
    formCount: space.formCount,
    forms: space.forms,
  })

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/spaces">
              <ArrowLeftIcon className="h-4 w-4" />
              <span className="sr-only">Back to spaces</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{space.name}</h1>
            <p className="text-sm text-muted-foreground">{space.description || "No description provided"}</p>
          </div>
        </div>
        <Link href={`/dashboard/spaces/${space.id}/forms/new`}>
          <Button size="sm" className="mt-2 sm:mt-0">
            <PlusIcon className="mr-2 h-4 w-4" />
            Create Form
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Forms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{space.formCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{space.reviewCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-2xl font-bold">
              {space.averageRating > 0 ? (
                <>
                  {space.averageRating.toFixed(1)}
                  <StarIcon className="ml-1 h-5 w-5 fill-yellow-500 text-yellow-500" />
                </>
              ) : (
                "N/A"
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="forms">Forms</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Space Overview</CardTitle>
              <CardDescription>Key information about {space.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Created</h3>
                <p className="text-sm text-muted-foreground">
                    {new Date(space.createdAt).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })} at {new Date(space.createdAt).toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
            })}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Last Updated</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(space.updatedAt).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })} at {new Date(space.updatedAt).toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Status</h3>
                <Badge variant="outline" className="mt-1">
                  Active
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forms" className="mt-4">
          {space.formCount > 0 && space.forms && space.forms.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {space.forms.map((form) => (
                <Card key={form.id}>
                  <CardHeader>
                    <CardTitle className="text-base">{form.title}</CardTitle>
                    <CardDescription>
                      Created on {new Date(form.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <StarIcon className="h-3 w-3" />
                        {form.reviews?.length || 0} reviews
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2">
                    <div className="flex w-full gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => {
                          const link = `${window.location.origin}/forms/${space.id}/${form.id}`
                          navigator.clipboard.writeText(link)
                          toast.success("Form link copied to clipboard")
                        }}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Link
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        asChild
                      >
                        <Link href={`/forms/${space.id}/${form.id}`} target="_blank">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Share
                        </Link>
                      </Button>
                    </div>
                    <Button 
                      className="w-full"
                      asChild
                    >
                      <Link href={`/dashboard/spaces/${space.id}/forms/${form.id}`}>
                        View Form
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <FileTextIcon className="mb-2 h-10 w-10 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">No forms yet</h3>
              <p className="mb-6 text-sm text-muted-foreground">
                Create your first form to start collecting reviews for this product.
              </p>
              <Link href={`/dashboard/spaces/${space.id}/forms/new`}>
                <Button>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Create Form
                </Button>
              </Link>
            </div>
          )}
        </TabsContent>

        <TabsContent value="reviews" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Reviews</CardTitle>
              <CardDescription>All reviews collected for {space.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This tab will display all reviews collected across all forms for this space.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Space Settings</CardTitle>
              <CardDescription>Manage settings for {space.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Space Name</h3>
                <div className="mt-1 flex items-center gap-2">
                  <Input value={spaceData.name} className="max-w-md" onChange={(e) => setSpaceData({ ...spaceData, name: e.target.value })} />
                  <Button variant="outline" size="sm">
                    Update
                  </Button>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium">Description</h3>
                <div className="mt-1 flex items-center gap-2">
                  <Textarea value={spaceData.description || ""} className="max-w-md" onChange={(e) => setSpaceData({ ...spaceData, description: e.target.value })}     />
                  <Button variant="outline" size="sm">
                    Update
                  </Button>
                </div>
              </div>
              <div className="pt-4">
                <h3 className="text-sm font-medium text-destructive">Danger Zone</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Once you delete a space, there is no going back. Please be certain.
                </p>
                <Button variant="destructive" size="sm" className="mt-2">
                  Delete Space
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

