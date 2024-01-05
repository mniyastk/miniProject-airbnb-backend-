const property = require("../model/staysModel");
const cloudinary = require("../helpers/cloudinary");
const users = require("../model/userModel");

const addListing = async (req, res) => {
  const files = req.files;
  const { id } = req.user;
  const propertyData = JSON.parse(req.body.property);
  const dart = propertyData.property;
  const {
    address,
    amenities,
    bathrooms,
    bedRooms,
    beds,
    country,
    description,
    host_id,
    maxGuests,
    price,
    propertyType,
    stayType,
    title,
  } = dart;

 
  const uploads = files.map(async (item) => {
    const result = await cloudinary.uploader.upload(item.path);
    return { url: result.secure_url };
  });

 
  const imageData = await Promise.all(uploads);

  
  const listing = await property.create({
    host_id,
    address,
    amenities,
    bathrooms,
    bedRooms,
    beds,
    country,
    description,
    images: imageData,
    maxGuests,
    price,
    propertyType,
    stayType,
    title,
    userType:"host"
  });

 
  await users.updateOne({ _id: id }, { $push: { listings: listing._id } ,$set:{userType:"host"}});

  res.status(201).json({ message: "success", data: listing });
};

/// get all listings ///

const listings = async (req, res) => {
  const host_id = req.user.id;
  const host = await users.findById(host_id).populate("listings");
  res.status(200).json({ message: "success", data: host.listings });
};

module.exports = { addListing, listings };
