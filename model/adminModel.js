const mongoose = require("mongoose");
const adminModel = new mongoose.Schema({
    admin:String,
    password:String
})
module.exports = mongoose.model("admin",adminModel)