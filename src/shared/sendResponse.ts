import { Response } from "express"

const sendResponse = <T>(
  res: Response,
  jsonData: {
    statusCode: number
    message: string
    meta?: {
      page: number
      limit: number
      total: number
    }
    data: T | null | undefined
  }
) => {
  res.status(jsonData.statusCode).json({
    message: jsonData.message,
    meta: jsonData.meta || null || undefined,
    data: jsonData.data || null || undefined,
    success: true,
  })
}

export default sendResponse
