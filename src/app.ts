import express, { Application, NextFunction, Request, Response } from "express"
import cors from "cors"
import morgan from "morgan"
import router from "./app/routes"
import httpStatus from "http-status"
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler"

const app: Application = express()
app.use(cors())
app.use(express.json())
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

export default app
