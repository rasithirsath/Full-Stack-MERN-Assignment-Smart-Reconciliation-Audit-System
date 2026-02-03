const UploadJob = require("../models/UploadJob");
const fileHash = require("../utils/fileHash");
const { processFileAsync } = require("../services/fileProcessor");
exports.uploadFile = async (req, res) => {
  try {
    console.log("UPLOAD HIT");
    console.log("FILE OBJECT:", req.file);

    const UploadJob = require("../models/UploadJob");
    const fileHash = require("../utils/fileHash");
    const { processFileAsync } = require("../services/fileProcessor");

    const hash = fileHash(req.file.path);

    const existingJob = await UploadJob.findOne({ fileHash: hash });
    if (existingJob) {
      return res.status(409).json({
        message: "This file was already processed. Please upload a new file.",
        jobId: existingJob._id,
      });
    }

    const job = await UploadJob.create({
      fileName: req.file.filename,
      fileHash: hash,
      uploadedBy: req.user.id,
      status: "Processing",
    });

    processFileAsync(job._id, req.file.path);

    res.json({ message: "Processing started", jobId: job._id });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getUploadStatus = async (req, res) => {
  const UploadJob = require("../models/UploadJob");

  const job = await UploadJob.findById(req.params.jobId);
  res.json(job);
};
