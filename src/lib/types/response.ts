export enum ErrorType {
  VALIDATION = 'VALIDATION',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INTERNAL = 'INTERNAL',
  CONFLICT = 'CONFLICT',
}

export enum SuccessType {
  OK = 'OK',
  CREATED = 'CREATED',
  NO_CONTENT = 'NO_CONTENT',
}

export type UseCaseResponse<T = unknown> = {
  success: boolean
  message: string
  type?: ErrorType | SuccessType
  data?: T
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
  error?: string
}
