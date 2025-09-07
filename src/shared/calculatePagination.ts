type IOptions = {
  page?: number
  limit?: number
  sortOrder?: "asc" | "desc"
  sortBy?: string
}

type IPagination = {
  limit: number
  skip: number
  orderBy: { [key: string]: "asc" | "desc" }
}

export const calculatePagination = (options: IOptions): IPagination => {
  const page = Number(options.page || 1)
  const limit = Number(options.limit || 10)
  const skip = (page - 1) * limit
  return {
    skip,
    limit,
    orderBy: { [options.sortBy || "createdAt"]: options.sortOrder || "desc" },
  }
}
