const users = require("../model/userModel");
const property = require("../model/staysModel");

/// find all users ///

const findAllUsers = async (req, res) => {
  const user = await users.find();
  res.status(200).json({ data: user });
};

/// find all verified lisings ///

const allListings = async (req, res) => {
  const listings = await property.find({verified:true});
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

const approveListing =async (req,res)=>{
  const listing = req.params.id
  const result = await property.updateOne({_id:listing},{$set:{verified:true}})
  if(result.modifiedCount===1){
    res.status(200).json({data:result})
  }else{
    res.status(400)
  }
  
}

module.exports = {
  findAllUsers,
  allListings,
  unverifiedListings,
  viewUnverifiedListing,
  approveListing
};
