const calculatePagination = (options: {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}) => {
  const page = Number(options.page) || 1
  const limit = Number(options.limit) || 10
  const skip = (page - 1) * limit

  const sortBy = options.sortBy || "createdAt"
  const sortOrder = options.sortOrder || "desc"
  return { skip, page, limit, sortBy, sortOrder }
}

export default calculatePagination
