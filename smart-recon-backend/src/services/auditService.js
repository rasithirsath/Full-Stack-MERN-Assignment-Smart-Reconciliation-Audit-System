const AuditLog = require("../models/AuditLog");

exports.logChanges = async ({
  recordId,
  oldDoc,
  newData,
  userId,
  source = "Manual",
}) => {
  const logs = [];

  for (const key of Object.keys(newData)) {
    const oldVal = oldDoc[key];
    const newVal = newData[key];

    // Only log real changes
    if (oldVal !== undefined && String(oldVal) !== String(newVal)) {
      logs.push({
        recordId,
        field: key,
        oldValue: String(oldVal),
        newValue: String(newVal),
        changedBy: userId,
        source,
      });
    }
  }

  if (logs.length) {
    await AuditLog.insertMany(logs);
  }
};
