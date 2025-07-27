import express from "express"

const router = express.Router()

router.get("/", (req: express.Request, res: express.Response) => {
  res.send({
    message: "User module is working",
    status: "success",
  })
})

export const userRoutes = router
