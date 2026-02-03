const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const { updateRecord } = require("../controllers/recordController");

router.put("/:id", auth, role("Admin", "Analyst"), updateRecord);

module.exports = router;
