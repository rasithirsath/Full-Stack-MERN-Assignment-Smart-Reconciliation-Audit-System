const AuditLog = require("../models/AuditLog");

exports.getTimeline = async (req, res) => {
  try {
    const { recordId } = req.params;

    const logs = await AuditLog.find({ recordId })
      .populate("changedBy", "name email")
      .sort({ createdAt: 1 });

    res.json(logs);
  } catch (err) {
    console.log("AUDIT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
