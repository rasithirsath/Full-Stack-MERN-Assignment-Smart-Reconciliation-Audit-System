const express = require("express");
const router = express.Router();
const { runReconciliation } = require("../services/reconciliationService");

router.post("/run/:jobId", async (req, res) => {
  await runReconciliation(req.params.jobId);
  res.json({ message: "Reconciliation triggered" });
});

module.exports = router;
