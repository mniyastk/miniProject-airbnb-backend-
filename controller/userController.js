const users = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const property = require("../model/staysModel");
// const asyncHandler = require("../middleware/async");

///user registration controller ///

const userRegistration = async (req, res) => {
  const { firstName, lastName, password, email, phone } = req.body.data;
  const alreadyExists = await users.findOne({
    $or: [{ email: email }, { phone: phone }],
  });
  if (!alreadyExists) {
    const encPassword = await bcrypt.hash(password, 12);
    const token = jwt.sign({ email: email }, process.env.USER_SECRET_KEY, {
      expiresIn: "1h",
    });
    const user = await users.create({
      firstName,
      lastName,
      password: encPassword,
      email,
      phone,
    });
    res.status(200).json({
      status: "success",
      token: token,
    });
    console.log(user);
  } else {
    console.log("user already exist");
    res.status(409).json({
      status: "failed",
      message: "user already exists with same email or phone number ",
    });
  }
};

/// User login controller ///
const userLogin = async (req, res) => {
  const { email, password } = req.body.data;
  const user = await users.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ id: user._id }, process.env.USER_SECRET_KEY, {
      expiresIn: "1h",
    });
    res.status(200).json({ message: "login success", token: token });
  } else {
    res.status(401).json({ message: "incorrect Password or email" });
  }
};

/// get all stays ///

const showStays = async (req, res) => {
  const stays = await property.find();
  if (!stays) {
    res.status(404).json({ message: "data fetching failed " });
  } else {
    res.status(200).json({ data: stays });
  }
};

/// show a specific Product ///

const specificStay = async (req, res) => {
  const id = req.params.id;

  const stay = await property.findById(id);
  if (!stay) {
    res.status(404).json({ message: "stay is not found " });
  } else {
    res.status(200).json({
      message: "success",
      data: stay,
    });
  }
};

/// Add to wishlists ///

const addToWishlists = async (req, res) => {
  const id = req.params.id;
  const user = req.user;
  const currentUser = await users.findById(user.id);
  const stay = await property.findById(id);
  if (currentUser.whishLists.includes(id) && stay) {
    res.send("stay already exists in wishlists");
  } else {
    await users.updateOne(
      { _id: user.id },
      { $push: { whishLists: stay._id } }
    );
    res.status(200).json({ message: "stay added to wishlists successfully" });
  }
};

/// Show user's wishlists ///

const viewWishlists = async (req, res) => {
  const test = req.user;
  const result = await users.findById(test.id).populate("whishLists");
  if (!result) {
    res.status(400).json({ message: "wishlists not found" });
  } else {
    res.status(200).json({ data: result.whishLists });
  }
};

/// Delete from users's wishlists ///

const deleteWishlist = async (req, res) => {
  const id = req.params;
  const user_id = req.user.id;

  const user = await users.updateOne(
    { _id: user_id },
    { $pull: { whishLists: id.id } }
  );
  if (user.modifiedCount !== 0) {
    res.status(204).json({ message: "item deleted successfully" });
  } else {
    res.status(400).json({ message: "stay does not exist on your wishlist" });
  }
};

/// Book a stay ///

const bookStay = async (req, res) => {
  const user_id = req.user.id;
  const stay = req.params.id;
  const details = req.body.data;
  const user = await users.findById(user_id)
  if(user.bookings.some(item=>item.stay===stay)){
    res.status(403).json({message:"this property is already booked by you"})
  }else{
    const confirmedBooking = await users.updateOne(
      { _id: user_id },
      {
        $push: {
          bookings:{ 
            checkInDate: details.check_in_date,
            checkOutDate: details.check_out_date,
            numberOfGuests: details.number_of_guests,
            stay:stay
          ,}
        },
      }
    );
    if(confirmedBooking.modifiedCount===1){
      res.status(200).json({message:"stay booked successfully"})
    }else{
      res.status(400).json({message:"booking failed"})
    }
    
  }   

  res.send(confirmedBooking);
};

const cancelBooking =async (req,res)=>{
  
}

module.exports = {
  userRegistration,
  userLogin,
  showStays,
  specificStay,
  addToWishlists,
  viewWishlists,
  deleteWishlist,
  bookStay,
};
