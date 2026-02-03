const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const reconciliationRoutes = require("./routes/reconciliationRoutes");
const recordRoutes = require("./routes/recordRoutes");
const auditRoutes = require("./routes/auditRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/auth", authRoutes);
app.use("/api/files", uploadRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reconciliation", reconciliationRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/test", require("./routes/testRoutes"));

app.get("/", (req, res) => {
  res.send("Smart Reconciliation API Running");
});

module.exports = app;
