const Record = require("../models/Record");
const ReconciliationResult = require("../models/ReconciliationResult");
const MatchingRule = require("../models/MatchingRule");

exports.runReconciliation = async (uploadJobId) => {
  console.log("🔍 Running reconciliation for job:", uploadJobId);

  const uploadedRecords = await Record.find({
    uploadJobId: uploadJobId,
  });

  console.log("📊 Records found:", uploadedRecords.length);

  const rule = await MatchingRule.findOne();
  const tolerance = rule?.partialMatchTolerance || 0.02;

  for (let record of uploadedRecords) {
    // 🔥 Remove old result to prevent duplicates
    await ReconciliationResult.deleteOne({ recordId: record._id });

    // 1️⃣ Duplicate check
    const duplicate = await Record.findOne({
      transactionId: record.transactionId,
      _id: { $ne: record._id },
    });

    if (duplicate) {
      await ReconciliationResult.create({
        recordId: record._id,
        status: "Duplicate",
      });
      continue;
    }

    // 2️⃣ Exact match
    const exact = await Record.findOne({
      transactionId: record.transactionId,
      amount: record.amount,
      _id: { $ne: record._id },
    });

    if (exact) {
      await ReconciliationResult.create({
        recordId: record._id,
        status: "Matched",
      });
      continue;
    }

    // 3️⃣ Partial match
    const partial = await Record.findOne({
      referenceNumber: record.referenceNumber,
      amount: {
        $gte: record.amount * (1 - tolerance),
        $lte: record.amount * (1 + tolerance),
      },
      _id: { $ne: record._id },
    });

    if (partial) {
      await ReconciliationResult.create({
        recordId: record._id,
        status: "Partially Matched",
        mismatchedFields: ["amount"],
      });
      continue;
    }

    // 4️⃣ Not matched
    await ReconciliationResult.create({
      recordId: record._id,
      status: "Not Matched",
    });
  }

  console.log("✅ Reconciliation finished");
};
