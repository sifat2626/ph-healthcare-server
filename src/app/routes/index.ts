import express from "express"
import { UserRoutes } from "../modules/User/user.route"
import { AdminRoutes } from "../modules/Admin/admin.route"
import { AuthRoutes } from "../modules/Auth/auth.routes"
const router = express.Router()

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/admins",
    route: AdminRoutes,
  },
]

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route)
})

export default router
