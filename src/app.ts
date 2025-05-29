import express, { Application, Request, Response } from "express"
import cors from "cors"
import { UserRoutes } from "./app/modules/User/user.route"
import { AdminRoutes } from "./app/modules/Admin/admin.route"

const app: Application = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "Welcome to the API",
    status: "success",
  })
})

app.use("/api/v1/users", UserRoutes)
app.use("/api/v1/admins", AdminRoutes)

export default app
