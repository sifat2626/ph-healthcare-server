import express, { Application, NextFunction, Request, Response } from "express"
import cors from "cors"
import morgan from "morgan"
import router from "./app/routes"
import httpStatus from "http-status"

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
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    message: error.name || "Something went wrong",
    success: false,
    error: error.message,
  })
})

export default app
