const Record = require("../models/Record");
const ReconciliationResult = require("../models/ReconciliationResult");
const AuditLog = require("../models/AuditLog");

exports.getReconciliationView = async (req, res) => {
  try {
    const records = await Record.find();

    const results = await ReconciliationResult.find();

    const merged = records.map((record) => {
      const result = results.find(
        (r) => r.recordId.toString() === record._id.toString(),
      );

      return {
        _id: record._id,
        transactionId: record.transactionId,
        amount: record.amount,
        referenceNumber: record.referenceNumber,
        date: record.date,
        status: result ? result.status : "Pending",
        mismatchedFields: result?.mismatchedFields || [],
      };
    });

    res.json(merged);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    const record = await Record.findById(id);

    // Detect change
    if (record.amount !== Number(amount)) {
      await AuditLog.create({
        recordId: record._id,
        field: "amount",
        oldValue: record.amount,
        newValue: amount,
        changedBy: req.user.id,
      });
    }

    record.amount = amount;
    await record.save();

    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
