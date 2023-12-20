const users = require("../model/userModel");
const property = require("../model/staysModel");

/// find all users ///

const findAllUsers = async (req, res) => {
  const user = await users.find();
  res.status(200).json({ data: user });
};

/// find all lisings ///

const allListings = async (req, res) => {
  const listings = await property.find();
  res.status(200).json({ data: listings });
};

module.exports = { findAllUsers ,allListings };
