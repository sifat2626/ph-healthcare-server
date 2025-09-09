import express, { Request, Response } from "express"
export const sendResponse = <T>(
  res: Response,
  jsonData: {
    statusCode: number
    message: string
    success: boolean
    data?: T | null | undefined
    meta?: {
      page: number
      limit: number
      total: number
    }
  }
) => {
  res.status(jsonData.statusCode).json({
    message: jsonData.message,
    success: jsonData.success,
    data: jsonData.data || null || undefined,
    meta: jsonData.meta || null || undefined,
  })
}
