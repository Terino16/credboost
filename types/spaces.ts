export interface Space {
    id: string
    name: string
    description: string
    createdAt: Date
    updatedAt: Date
    formCount: number
    reviewCount: number
    averageRating: number
    forms?: {
      id: string
      title: string
      createdAt: Date
      reviews?: {
        id: string
        rating: number
      }[]
    }[]
    userId: string
    productId: string
  }
  
  export interface SpaceFormCount {
    spaceId: string
    formCount: number
  }
  
  export interface CreateSpaceFormData {
    name: string
    description?: string
  }
  
  