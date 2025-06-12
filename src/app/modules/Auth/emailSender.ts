import nodemailer from "nodemailer"
import config from "../../../config"

const emailSender = async (to: string, subject: string, html: string) => {
  // Create a test account or replace with real credentials.
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.emailSender.email,
      pass: config.emailSender.app_pass,
    },
    tls: {
      rejectUnauthorized: false, // Allow self-signed certificates
    },
  })

  // Wrap in an async IIFE so we can use await.
  const info = await transporter.sendMail({
    from: `PH-Health-Care <${config.emailSender.email}>`, // sender address
    to,
    subject,
    // text: "Hello world?", // plain‑text body
    html, // HTML body
  })

  console.log("Message sent:", info.messageId)
}

export default emailSender
