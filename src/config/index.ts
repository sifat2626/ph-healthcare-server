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
  bcrypt: {
    saltRounds: Number(env.SALT_ROUNDS) || 12,
  },
  client: {
    url: env.CLIENT_URL || "http://localhost:3000",
  },
  email: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASSWORD,
  },
}
