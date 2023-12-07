const property = require("../model/staysModel");
const cloudinary = require("../helpers/cloudinary");

const addListing = async (req, res) => {
  const imageData = [];

  try {
    const files=req.files
    console.log(files)
const propertyData = JSON.parse(req.body.property);
const dart =propertyData.property


    const {
      address,
      amenities,
      bathrooms,
      bedRooms,
      beds,
      country,
      description,
      images,
      maxGuests,
      price,
      propertyType,
      stayType,
      title,
    } =dart;
   

   
    const uploads = files.map(async (item) => {
      const result = await cloudinary.uploader.upload(item.path);
      return result
    });

    Promise.all(uploads).then((data) => {
      console.log(data)
      data.map((item) => imageData.push({url:item.secure_url}))
    })
    .then(()=>{
     const listing= property.create({
        address,
        amenities,
        bathrooms,
        bedRooms,
        beds,
        country,
        description,
        images:imageData,
        maxGuests,
        price,
        propertyType,
        stayType,
        title,
      })
      res.status(201).json({ message: "success", data: listing });
    })
    .catch(e=>console.log(e))
    
    
  } catch (error) {
    res.send(error);
  }
};

const imageUplaod = async (req, res) => {
  const test = [];
  try {
    // const files = req.files;
    const files=req.files
    console.log(files)
const data = req.body.property

console.log(data);
    // console.log(files);
    // const uplads = files.map(async (file) => {
    //   const result = await cloudinary.uploader.upload(file.path);
    //   return result;
    // });
    // Promise.all(uplads).then((data) => {
    //   data.map((item) => test.push(item.secure_url));
    // });
    // Promise.all(uplads).then(() => console.log(test));
  } catch (error) {
    res.send(error);
  }
};
const test = (req, res) => {
  res.send("success");
};

module.exports = { addListing, test, imageUplaod };
