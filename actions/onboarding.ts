'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function saveOnboardingData(formData: {
  name: string
  age: string
  source: string
  spaceName: string
  spaceLogo: string | null
  spaceDescription: string
}) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      throw new Error('Unauthorized')
    }

    const client = await clerkClient();

    // Update Clerk metadata for onboarding status only
    await client.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
      },
    })

    // Create or update user with onboarding data in our database
    const user = await db.user.upsert({
      where: { 
        id: userId 
      },
      update: {
        name: formData.name,
        age: parseInt(formData.age),
        source: formData.source,
      },
      create: {
        id: userId,
        name: formData.name,
        age: parseInt(formData.age),
        source: formData.source,
        subscriptionLevel: 'free',
      },
    })

    // Create default product if none exists
    const defaultProduct = await db.product.findFirst() || 
      await db.product.create({
        data: {
          name: 'Default Product',
          description: 'Default product for new spaces',
        },
      })

    // Create space
    const space = await db.space.create({
      data: {
        userId: user.id,
        productId: defaultProduct.id,
        name: formData.spaceName,
        description: formData.spaceDescription,
        logoUrl: formData.spaceLogo,
      },
    })

    revalidatePath('/dashboard')
    return { success: true, spaceId: space.id }
  } catch (error) {
    console.error('Error saving onboarding data:', error)
    return { success: false, error: 'Failed to save onboarding data' }
  }
} 