const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const Record = require("../models/Record");
const UploadJob = require("../models/UploadJob");
const { runReconciliation } = require("./reconciliationService");

exports.processFileAsync = async (jobId, filePath) => {
  try {
    console.log("PROCESS STARTED:", jobId);

    const fullPath = path.resolve(filePath);
    console.log("FULL FILE PATH:", fullPath);

    if (!fs.existsSync(fullPath)) {
      throw new Error("File does not exist");
    }

    const records = [];

    fs.createReadStream(fullPath)
      .pipe(csv())
      .on("data", (row) => {
        records.push({
          transactionId: row.TransactionID,
          amount: parseFloat(row.Amount),
          referenceNumber: row.ReferenceNumber,
          date: new Date(row.Date),
          uploadJobId: jobId,
        });
      })
      .on("end", async () => {
        try {
          console.log("CSV Parsed:", records.length);

          if (!records.length) throw new Error("CSV Empty");

          await Record.insertMany(records);
          console.log("Records inserted");

          await runReconciliation(jobId);
          console.log("Reconciliation done");

          await UploadJob.findByIdAndUpdate(jobId, { status: "Completed" });
          console.log("JOB COMPLETED:", jobId);
        } catch (err) {
          console.error("PROCESS ERROR:", err);
          await UploadJob.findByIdAndUpdate(jobId, { status: "Failed" });
        }
      })
      .on("error", async (err) => {
        console.error("CSV STREAM ERROR:", err);
        await UploadJob.findByIdAndUpdate(jobId, { status: "Failed" });
      });
  } catch (err) {
    console.error("PROCESS INIT ERROR:", err);
    await UploadJob.findByIdAndUpdate(jobId, { status: "Failed" });
  }
};
