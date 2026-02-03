const Record = require("../models/Record");
const ReconciliationResult = require("../models/ReconciliationResult");

exports.getSummary = async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;

    const recordFilter = {};
    if (startDate && endDate) {
      recordFilter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const totalRecords = await Record.countDocuments(recordFilter);

    const resultFilter = {};
    if (status) resultFilter.status = status;

    const matched = await ReconciliationResult.countDocuments({
      ...resultFilter,
      status: "Matched",
    });
    const partial = await ReconciliationResult.countDocuments({
      ...resultFilter,
      status: "Partially Matched",
    });
    const unmatched = await ReconciliationResult.countDocuments({
      ...resultFilter,
      status: "Not Matched",
    });
    const duplicates = await ReconciliationResult.countDocuments({
      ...resultFilter,
      status: "Duplicate",
    });

    const accuracy = totalRecords
      ? ((matched / totalRecords) * 100).toFixed(2)
      : 0;

    res.json({
      totalRecords,
      matched,
      partial,
      unmatched,
      duplicates,
      accuracy,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
