const users = require("../model/userModel");
const property = require("../model/staysModel");
const adminModel = require("../model/adminModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/// admin login ///

const adminLogin = async (req, res) => {
  const { admin, password } = req.body;
  console.log(admin,password)
  const [adminDetail] = await adminModel.find({ admin });
  console.log(adminDetail)
  if (adminDetail.password === password) {
    console.log("hi");
    const token = jwt.sign(
      { id: adminDetail._id },
      process.env.USER_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({
      message: "login success",
      data: { token: token, admin: adminDetail._id },
    });
  } else {
    res.status(401).json({ message: "incorrect Password or email" });
  }
};

/// find all users ///

const findAllUsers = async (req, res) => {
  const user = await users.find();
  res.status(200).json({ data: user });
};

/// find all verified lisings ///

const allListings = async (req, res) => {
  const listings = await property.find({ verified: true });
  res.status(200).json({ data: listings });
};

/// find all unverified listings ///

const unverifiedListings = async (req, res) => {
  const listings = await property.find({ verified: false });
  res.status(200).json({ data: listings });
};

/// show a specified unverified listing ///

const viewUnverifiedListing = async (req, res) => {
  const id = req.params.id;
  const [listing] = await property.find({
    $and: [{ verified: false }, { _id: id }],
  });
  res.status(200).json({ data: listing });
};

/// approve Listings ///

const approveListing = async (req, res) => {
  const listing = req.params.id;
  const result = await property.updateOne(
    { _id: listing },
    { $set: { verified: true } }
  );
  if (result.modifiedCount === 1) {
    res.status(200).json({ data: result });
  } else {
    res.status(400);
  }
};

/// Disapprove Listings ///

const disapproveListing = async (req, res) => {
  const listing = req.params.id;
  const result = await property.deleteOne({ _id: listing });
  if (result.deletedCount === 1) {
    res.status(200).json({ message: "resource deleted successfully" });
  } else {
    res.status(400);
  }
};

/// Block an user ///

const blockUser = async (req, res) => {
  const { id } = req.params;
  const { input } = req.body;
  const user = await users.updateOne(
    { _id: id },
    { $set: { user_status: input.user_status } }
  );
  if (user.modifiedCount === 1) {
    res.status(200).json({ message: "success" });
  } else {
    res.status(400).json({ message: "failed operation" });
  }
};

module.exports = {
  findAllUsers,
  allListings,
  unverifiedListings,
  viewUnverifiedListing,
  approveListing,
  disapproveListing,
  blockUser,
  adminLogin,
};
