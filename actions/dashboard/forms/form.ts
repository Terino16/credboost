'use server'

import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { Form } from '@/types/forms'

const questionSchema = z.object({
  text: z.string().min(3).max(200),
  required: z.boolean(),
  type: z.enum(['text', 'textarea', 'radio', 'checkbox']),
  options: z.array(z.string()).optional(),
})

const formSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  logoUrl: z.string().optional(),
  requireAuthentication: z.boolean(),
  offerDiscount: z.boolean(),
  discountCode: z.string().optional(),
  discountValue: z.string().optional(),
  thankYouMessage: z.string().min(3).max(500),
  questions: z.array(questionSchema).min(1).max(5),
  spaceId: z.string()
})

export async function createForm(data: z.infer<typeof formSchema>) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return { success: false, error: 'Unauthorized' }
    }

    // Verify user owns the space
    const space = await db.space.findUnique({
      where: {
        id: data.spaceId,
        userId: userId // Make sure to match both space ID and user ID
      }
    })

    if (!space) {
      return { success: false, error: 'Space not found or unauthorized' }
    }

    // Generate a unique public link
    const publicLink = `form-${space.id}-${Math.random().toString(36).substring(2, 15)}`

    // Create form with questions
    const form = await db.form.create({
      data: {
        spaceId: data.spaceId,
        title: data.title,
        description: data.description,
        logoUrl: data.logoUrl,
        requireAuthentication: data.requireAuthentication,
        offerDiscount: data.offerDiscount,
        discountCode: data.discountCode,
        discountValue: data.discountValue,
        thankYouMessage: data.thankYouMessage,
        publicLink,
        questions: {
          create: data.questions.map((question, index) => ({
            text: question.text,
            required: question.required,
            type: question.type,
            options: question.options || [],
            order: index
          }))
        }
      },
      include: {
        questions: true
      }
    })

    revalidatePath(`/dashboard/spaces/${data.spaceId}`)
    return { success: true, formId: form.id }

  } catch (error) {
    console.error('Error creating form:', error)
    return { success: false, error: 'Failed to create form' }
  }
}

export async function getForm(formId: string, spaceId: string) {
  try {
    const form = await db.form.findFirst({
      where: {
        id: formId,
        spaceId: spaceId
      },
      include: {
        questions: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    if (!form) {
      return { success: false, error: 'Form not found' }
    }

    // Transform the data to match the expected type
    const transformedForm: Form = {
      id: form.id,
      title: form.title,
      description: form.description,
      logoUrl: form.logoUrl,
      questions: form.questions.map(q => ({
        id: q.id,
        text: q.text,
        required: q.required,
        type: q.type,
        options: q.options || [],
        order: q.order,
        formId: q.formId
      })),
      thankYouMessage: form.thankYouMessage,
      offerDiscount: form.offerDiscount,
      discountCode: form.discountCode,
      discountValue: form.discountValue,
      requireAuthentication: form.requireAuthentication,
      spaceId: form.spaceId,
      publicLink: form.publicLink,
      createdAt: form.createdAt
    }

    return { 
      success: true, 
      form: transformedForm
    }
  } catch (error) {
    console.error('Error fetching form:', error)
    return { success: false, error: 'Failed to fetch form' }
  }
} 