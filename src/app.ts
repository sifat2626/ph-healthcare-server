import express, { Application, NextFunction, Request, Response } from "express"
import cors from "cors"
import { UserRoutes } from "./app/modules/User/user.route"
import { AdminRoutes } from "./app/modules/Admin/admin.route"
import router from "./app/routes"
import globalErrorHandler from "./middlewares/globalErrorHandler"

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

app.use("/api/v1", router)

app.use(globalErrorHandler)

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    message: "API Not Found",
    success: false,
    error: {
      path: req.originalUrl,
      message: "Your requested API path was not found",
    },
  })
})

export default app
