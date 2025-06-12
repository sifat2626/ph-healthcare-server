import multer from "multer"
import path from "path"
import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

cloudinary.config({
  cloud_name: "dlkloclrg",
  api_key: "726491447257243",
  api_secret: "FCg7xDqx4VOGc559yNSFsQeE0Rw", // Click 'View API Keys' above to copy your API secret
})

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"))
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
})

export const uploadToCloudinary = async (file: Express.Multer.File) => {
  // Upload an image
  const uploadResult = await cloudinary.uploader
    .upload(file.path)
    .catch((error) => {
      console.log(error)
    })
    .finally(() => {
      fs.unlinkSync(file.path) // Delete the file after upload
    })
  console.log("Upload Result:", uploadResult)
  return uploadResult
}

export const upload = multer({ storage: storage })
