'use server'

import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import type { Space, SpaceFormCount } from "@/types/spaces"

// Mock function to get user subscription details
// In a real app, this would fetch from your database or auth provider
export async function getUserSubscription() {
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { 
      subscriptionLevel: true,
      spaces: {
        select: { id: true }
      }
    }
  })

  const limits = {
    free: 2,
    paid: 5,
    ultra_premium: 10
  }

  return {
    plan: user?.subscriptionLevel || 'free',
    spacesLimit: limits[user?.subscriptionLevel || 'free'],
    currentSpaces: user?.spaces.length || 0
  }
}

// Mock function to get spaces
// In a real app, this would fetch from your database
export async function getSpaces(): Promise<Space[]> {
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }

  const spaces = await db.space.findMany({
    where: {
      userId
    },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      userId: true,
      productId: true,
      _count: {
        select: {
          forms: true
        }
      },
      forms: {
        include: {
          reviews: {
            select: {
              rating: true,
              id: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return spaces.map(space => ({
    id: space.id,
    name: space.name,
    description: space.description || "",
    createdAt: space.createdAt,
    updatedAt: space.updatedAt,
    formCount: space._count.forms,
    reviewCount: space.forms.reduce((acc, form) => acc + form.reviews.length, 0),
    averageRating: calculateAverageRating(space.forms),
    forms: space.forms,
    userId: space.userId,
    productId: space.productId
  }))
}

// Helper function to calculate average rating
function calculateAverageRating(forms: any[]) {
  const totalReviews = forms.reduce((acc, form) => acc + form.reviews.length, 0)
  if (totalReviews === 0) return 0

  const sumRatings = forms.reduce((acc, form) => {
    return acc + form.reviews.reduce((sum: number, review: any) => sum + (review.rating || 0), 0)
  }, 0)

  return sumRatings / totalReviews
}

// Mock function to get form counts for each space
// In a real app, this would fetch from your database
export async function getSpaceFormCounts(): Promise<SpaceFormCount[]> {
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }

  const spaces = await db.space.findMany({
    where: {
      userId
    },
    select: {
      id: true,
      _count: {
        select: {
          forms: true
        }
      }
    }
  })

  return spaces.map(space => ({
    spaceId: space.id,
    formCount: space._count.forms
  }))
}

// Mock function to create a new space
// In a real app, this would send a request to your API
export async function createSpace(data: {
  name: string
  description?: string
}) {
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }

  // Create default product if none exists
  const defaultProduct = await db.product.findFirst() || 
    await db.product.create({
      data: {
        name: 'Default Product',
        description: 'Default product for new spaces',
      },
    })

  const space = await db.space.create({
    data: {
      name: data.name,
      description: data.description,
      userId,
      productId: defaultProduct.id
    }
  })

  revalidatePath('/dashboard/spaces')
  
  return {
    id: space.id,
    name: space.name,
    description: space.description || "",
    createdAt: space.createdAt.toISOString(),
    updatedAt: space.createdAt.toISOString(),
    formCount: 0,
    reviewCount: 0,
    averageRating: 0
  }
}

// Mock function to delete a space
// In a real app, this would send a request to your API
export async function deleteSpace(spaceId: string) {
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }

  // Verify ownership
  const space = await db.space.findFirst({
    where: {
      id: spaceId,
      userId
    }
  })

  if (!space) {
    throw new Error('Space not found or unauthorized')
  }

  await db.space.delete({
    where: {
      id: spaceId
    }
  })

  revalidatePath('/dashboard/spaces')
  return { success: true }
}

export async function getSpace(spaceId: string) {
  try {
    const { userId } = await auth()

    if (!userId) {
      throw new Error('Unauthorized')
    }

    const space = await db.space.findFirst({
      where: {
        id: spaceId,
        userId
      },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
        productId: true,
        forms: {
          include: {
            reviews: true
          }
        }
      }
    })

    if (!space) {
      return { success: false, error: 'Space not found' }
    }

    const transformedSpace: Space = {
      id: space.id,
      name: space.name,
      description: space.description || "",
      createdAt: space.createdAt,
      updatedAt: space.updatedAt,
      formCount: space.forms.length,
      reviewCount: space.forms.reduce((acc, form) => acc + form.reviews.length, 0),
      averageRating: space.forms.reduce((acc, form) => {
        const formRatings = form.reviews.map(r => r.rating)
        return acc + (formRatings.reduce((a, b) => a + b, 0) / formRatings.length || 0)
      }, 0) / (space.forms.length || 1),
      forms: space.forms,
      userId: space.userId,
      productId: space.productId
    }

    return { success: true, space: transformedSpace }
  } catch (error) {
    console.error('Error fetching space:', error)
    return { success: false, error: 'Failed to fetch space' }
  }
}

