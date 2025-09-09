import express from "express"
import { userRoutes } from "../modules/User/user.routes"
import { AdminRoutes } from "../modules/Admin/admin.routes"

const router = express.Router()

const moduleRoutes = [
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/admins",
    route: AdminRoutes,
  },
]

moduleRoutes.forEach(({ path, route }) => {
  router.use(path, route)
})

export default router
