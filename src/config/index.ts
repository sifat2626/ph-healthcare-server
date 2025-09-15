import dotenv from "dotenv"
import path from "path"
import { env } from "process"
require("dotenv").config({
  path: path.join(process.cwd() + "/.env"),
})

export default {
  env: env.NODE_ENV || "development",
  port: env.PORT || 5000,
  jwt: {
    jwtSecret: env.JWT_SECRET,
    refreshTokenSecret: env.REFRESH_TOKEN_SECRET,
    accessTokenExpiresIn: env.ACCESS_TOKEN_EXPIRES_IN || "5m",
    refreshTokenExpiresIn: env.REFRESH_TOKEN_EXPIRES_IN || "30d",
  },
}
