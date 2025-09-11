type IPaginationOptions = {
  page?: number
  limit?: number
  orderBy?: {
    [key: string]: "asc" | "desc"
  }
  sortBy?: string | undefined
  sortOrder?: "asc" | "desc" | undefined
}
