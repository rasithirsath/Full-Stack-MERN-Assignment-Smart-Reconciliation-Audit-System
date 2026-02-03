const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const uploadController = require("../controllers/uploadController");

// 🔥 DEBUG — ensure functions exist
console.log("uploadFile:", typeof uploadController.uploadFile);
console.log("getUploadStatus:", typeof uploadController.getUploadStatus);

router.post(
  "/upload",
  auth,
  upload.single("file"),
  uploadController.uploadFile,
);

router.get("/:jobId", auth, uploadController.getUploadStatus);

module.exports = router;
