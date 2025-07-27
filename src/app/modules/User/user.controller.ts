import { userService } from "./user.service"
import { Request, Response } from "express"

const createAdmin = async (req: Request, res: Response) => {
  const result = await userService.createAdmin()
  res.status(200).send(result)
}

export const userController = {
  createAdmin,
}
