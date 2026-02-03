const fs = require("fs");
const crypto = require("crypto");

module.exports = (filePath) => {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(fileBuffer).digest("hex");
};
