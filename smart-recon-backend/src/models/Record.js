const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
  transactionId: { type: String, index: true },
  amount: Number,
  referenceNumber: { type: String, index: true },
  date: Date,
  uploadJobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UploadJob",
    index: true,
  },
});

module.exports = mongoose.model("Record", recordSchema);
