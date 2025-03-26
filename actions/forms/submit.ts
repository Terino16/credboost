'use server'

import { db } from "@/lib/db"
import { z } from "zod"

const answerSchema = z.object({
  formId: z.string(),
  answers: z.array(z.object({
    questionId: z.string(),
    value: z.union([z.string(), z.array(z.string())]),
  }))
})

export async function submitFormResponse(formId: string, values: Record<string, { value: any; questionText: string }>) {
  try {
    // Find a rating question's value if it exists
    const ratingValue = Object.values(values).find(
      v => typeof v.value === 'number' && v.value >= 1 && v.value <= 5
    )?.value || 0

    // Create content from all answers
    const content = Object.entries(values)
      .map(([_, { value, questionText }]) => {
        const answerValue = Array.isArray(value) ? value.join(', ') : value.toString()
        return `${questionText}: ${answerValue}`
      })
      .join('\n')

    // Create the review with both content and rating
    const review = await db.review.create({
      data: {
        formId,
        content,
        rating: ratingValue,
        submittedAt: new Date(),
      }
    })

    // Create individual answers
    const answers = Object.entries(values).map(([questionId, { value }]) => ({
      questionId,
      value: Array.isArray(value) ? value.join(', ') : value.toString(),
      reviewId: review.id
    }))

    await db.answer.createMany({
      data: answers
    })

    return { success: true }
  } catch (error) {
    console.error('Error submitting form response:', error)
    return { success: false, error: 'Failed to submit form response' }
  }
} 