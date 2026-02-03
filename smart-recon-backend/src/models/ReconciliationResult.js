const mongoose = require("mongoose");

const reconciliationSchema = new mongoose.Schema({
  recordId: { type: mongoose.Schema.Types.ObjectId, ref: "Record" },
  status: {
    type: String,
    enum: ["Matched", "Partially Matched", "Not Matched", "Duplicate"],
  },
  mismatchedFields: [String],
});

module.exports = mongoose.model("ReconciliationResult", reconciliationSchema);
