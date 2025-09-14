import express, { Application, NextFunction, Request, Response } from "express"
import cors from "cors"
import morgan from "morgan"
import router from "./app/routes"
import httpStatus from "http-status"
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler"
import cookieParser from "cookie-parser"

const app: Application = express()
app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(morgan("dev"))

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "Welcome to the PH Healthcare API",
    status: "success",
  })
})

app.use("/api/v1", router)
app.use(globalErrorHandler)

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    message: "API Not Found",
    success: false,
    error: {
      path: req.originalUrl,
      message: "The requested API endpoint does not exist",
    },
  })
})

export default app
