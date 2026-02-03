const mongoose = require("mongoose");

const auditSchema = new mongoose.Schema(
  {
    recordId: { type: mongoose.Schema.Types.ObjectId, ref: "Record" },
    field: String,
    oldValue: String,
    newValue: String,
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("AuditLog", auditSchema);
