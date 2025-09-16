import multer from "multer"
import path from "path"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: "dlkloclrg",
  api_key: "726491447257243",
  api_secret: "FCg7xDqx4VOGc559yNSFsQeE0Rw", // Click 'View API Keys' above to copy your API secret
})

const uploadToCloudinary = async (file: any) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "user_uploads", // Optional: specify a folder in Cloudinary
    })
    return result.secure_url // Return the URL of the uploaded image
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error)
    throw new Error("Image upload failed")
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads/"))
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage: storage })

export const fileUploader = {
  upload,
  uploadToCloudinary,
}
