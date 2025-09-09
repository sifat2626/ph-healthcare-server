import express, { Application, Request, Response } from "express"
import cors from "cors"
import morgan from "morgan"
import { userRoutes } from "./app/modules/User/user.routes"
import router from "./app/routes"

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

export default app
