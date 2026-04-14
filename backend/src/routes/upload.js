const express = require("express");
const multer = require("multer");
const initCloudinary = require("../config/cloudinary");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const cloudinary = initCloudinary();

router.post("/", upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "comp3133_employees"
    });

    return res.json({
      success: true,
      message: "Uploaded to Cloudinary",
      url: result.secure_url,
      public_id: result.public_id
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Upload failed", error: err.message });
  }
});

module.exports = router;