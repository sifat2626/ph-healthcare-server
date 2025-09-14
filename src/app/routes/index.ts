import express from "express"
import { userRoutes } from "../modules/User/user.routes"
import { AdminRoutes } from "../modules/Admin/admin.routes"
import { AuthRoutes } from "../modules/Auth/auth.route"

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
  {
    path: "/auth",
    route: AuthRoutes,
  },
]

moduleRoutes.forEach(({ path, route }) => {
  router.use(path, route)
})

export default router
