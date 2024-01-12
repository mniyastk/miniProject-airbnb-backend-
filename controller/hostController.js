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

/// Edit listings ///

const editListing = async (req,res)=>{

const files = req.files
const uploads = files.map(async (item) => {
  const result = await cloudinary.uploader.upload(item.path);
  return { url: result.secure_url };
});


const imageData = await Promise.all(uploads);

const data =await  JSON.parse(req.body.editDatas)
const {maxGuests,beds,bathRooms,bedRooms,description,price,title,host_id,property_id}= data
const accessData = {
  $set:{
    maxGuests:maxGuests,
    beds:beds,
    bathRooms:bathRooms,
    bedRooms:bedRooms,
    description:description,
    price:price,
    title:title,
    images:imageData
  }
}
const filterData  = Object.fromEntries(
  Object.entries(accessData.$set).filter(([key, value]) =>{
   if (Array.isArray(value)) {
    return value.length > 0; 
  } else {
    return value !== ""; 
  }
})
);
console.log(filterData);
console.log(accessData);
if(imageData){
  const stay = await property.updateOne({_id:data.property_id},filterData)
  res.status(200).json({data:imageData ,stay})
}



}

module.exports = { addListing, listings ,editListing};
