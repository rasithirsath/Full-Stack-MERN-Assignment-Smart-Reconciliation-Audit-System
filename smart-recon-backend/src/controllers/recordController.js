const Record = require("../models/Record");
const { logChanges } = require("../services/auditService");

exports.updateRecord = async (req, res) => {
  try {
    const { id } = req.params; // record id
    const updates = req.body; // fields to change

    const record = await Record.findById(id);
    if (!record) return res.status(404).json({ message: "Record not found" });

    // Keep a copy of old values
    const oldDoc = record.toObject();

    // Apply updates
    Object.assign(record, updates);
    await record.save();

    // Write audit logs
    await logChanges({
      recordId: record._id,
      oldDoc,
      newData: updates,
      userId: req.user.id,
      source: "Manual",
    });

    res.json({ message: "Record updated with audit log" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
