type IOptions = {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

type IOptionResults = {
  skip: number
  page: number
  limit: number
  sortBy: string
  sortOrder: "asc" | "desc"
}

const calculatePagination = (options: IOptions): IOptionResults => {
  const page = Number(options.page) || 1
  const limit = Number(options.limit) || 10
  const skip = (page - 1) * limit

  const sortBy = options.sortBy || "createdAt"
  const sortOrder = options.sortOrder || "desc"
  return { skip, page, limit, sortBy, sortOrder }
}

export default calculatePagination
