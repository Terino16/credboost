export type QuestionType = 'text' | 'textarea' | 'radio' | 'checkbox' | 'rating'

export interface Question {
  id: string
  text: string
  type: QuestionType
  required: boolean
  options?: string[]
  formId: string
}

export interface Form {
  id: string
  title: string
  description?: string | null
  logoUrl?: string | null
  questions: Question[]
  thankYouMessage: string
  offerDiscount: boolean
  discountCode?: string | null
  discountValue?: string | null
  requireAuthentication: boolean
  spaceId: string
  publicLink: string
  createdAt: Date
} 