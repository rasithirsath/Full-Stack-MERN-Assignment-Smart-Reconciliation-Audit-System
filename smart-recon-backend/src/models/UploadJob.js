const mongoose = require("mongoose");

const uploadJobSchema = new mongoose.Schema(
  {
    fileName: String,
    fileHash: { type: String, unique: true },

    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["Processing", "Completed", "Failed"],
      default: "Processing",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("UploadJob", uploadJobSchema);
