const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  getReconciliationView,
  updateRecord, // 👈 ADD THIS
} = require("../controllers/reconciliationController");

router.get("/", auth, getReconciliationView);
router.put("/:id", auth, updateRecord);
module.exports = router;
