const mongoose = require("mongoose");

const userModel = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: false,
  },
  profilePicture: {
    type: String,
  },
  phone: {
    type: String,
    required: false,
  },
  userType: {
    type: String,
    default: "user",
  },
  bookings: [
    {
      checkInDate: { type: Date },
      checkOutDate: { type: Date },
      stay: { type: mongoose.Schema.Types.ObjectId, ref: "properties" },
      guests:{type:Number},
      invoiceData:{
        full_name:{type:String},
        address:{type:Object},
        nights:{type:Number},
        pricePerNight:{type:Number},
        serviceFee:{type:Number},
        total:{type:Number},
        paymentDate:{type:Date},
       
   
      }
    },
  ],
  whishLists: [{ type: mongoose.Schema.Types.ObjectId, ref: "properties" }],
  listings: [{ type: mongoose.Schema.Types.ObjectId, ref: "properties" }],
  user_status: {
    type: String,
    default: "active",
  },
});

module.exports = mongoose.model("users", userModel);
