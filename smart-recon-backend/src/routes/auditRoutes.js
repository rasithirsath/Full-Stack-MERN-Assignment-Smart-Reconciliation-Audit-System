const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { getTimeline } = require("../controllers/auditController");

router.get("/:recordId", auth, getTimeline);

module.exports = router;
