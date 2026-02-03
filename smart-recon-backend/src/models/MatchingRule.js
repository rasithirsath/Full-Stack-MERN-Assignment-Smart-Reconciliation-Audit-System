const mongoose = require("mongoose");

const ruleSchema = new mongoose.Schema({
  exactMatchFields: [String],
  partialMatchTolerance: Number,
});

module.exports = mongoose.model("MatchingRule", ruleSchema);
