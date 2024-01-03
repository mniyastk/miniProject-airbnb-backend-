const mongoose = require("mongoose");

const verifiedStays = new mongoose.Schema({
  verifiedProperties: [{ type: mongoose.Schema.Types.ObjectId, ref: "properties" }],
});

module.exports = mongoose.model("verifiedStays", verifiedStays);
