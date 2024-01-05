const users = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const crypto = require("crypto");
const razorpay = require("razorpay");
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

/// user register using google auth ///

const googleLogin = async (req, res) => {
  const { given_name, family_name, email } = req.body.res.data;
  const existingUser = await users.findOne({ email: email });

  if (existingUser) {
    if (existingUser.user_status === "active") {
      const token = jwt.sign(
        { id: existingUser._id },
        process.env.USER_SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );
      res.status(200).json({
        message: "user logined successfully",
        token: token,
        user_id: existingUser._id,
      });
    } else {
      res.status(401).json({ message: "You are Blocked !, Contact support" });
    }
  } else {
    const user = await users.create({
      firstName: given_name,
      lastName: family_name,
      email,
    });
    const token = jwt.sign({ id: user._id }, process.env.USER_SECRET_KEY, {
      expiresIn: "1h",
    });
    res
      .status(201)
      .json({ message: "user resgistered successfully", token: token });
  }
};

/// User login controller ///
const userLogin = async (req, res) => {
  const { email, password } = req.body.data;
  const user = await users.findOne({ email });

  if (
    user.user_status === "active" &&
    (await bcrypt.compare(password, user.password))
  ) {
    const token = jwt.sign({ id: user._id }, process.env.USER_SECRET_KEY, {
      expiresIn: "1h",
    });
    res.status(200).json({
      message: "login success",
      data: { token: token, user_id: user._id },
    });
  } else {
    if (user.user_status === "blocked") {
      res.status(401).json({ message: "Your are blocked !! Contact support" });
    } else {
      res.status(401).json({ message: "incorrect Password or email" });
    }
  }
};

/// get all stays ///

const showStays = async (req, res) => {
  const stays = await property.find({ verified: true });
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
  console.log(user, id);
  const currentUser = await users.findById(user.id);
  const stay = await property.findById(id);
  console.log(stay, currentUser);
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

/// Create an order ///

const orderCreate = async (req, res) => {
  const instance = new razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET,
  });
  console.log(req.body);
  const options = {
    amount: req.body.data.amount * 100,
    currency: "INR",
    receipt: crypto.randomBytes(10).toString("hex"),
  };
  instance.orders.create(options, (error, order) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: error });
    } else {
      console.log(order);
      res
        .status(200)
        .json({ message: "order created successfully", data: order });
    }
  });
};

/// Book a stay ///

const bookStay = async (req, res) => {
  const user_id = req.user.id;
  const stay = req.params.id;

  const details = req.body.data;

  const user = await users.findById(user_id);

  if (user.bookings.some((item) => item.stay === stay)) {
    res.status(403).json({ message: "this property is already booked by you" });
  } else {
    const confirmedBooking = await users.updateOne(
      { _id: user_id },
      {
        $push: {
          bookings: {
            checkInDate: details.check_in_date,
            checkOutDate: details.check_out_date,
            guests: details.number_of_guests,
            stay: stay,
            invoiceData:{
              full_name:user.firstName+" "+user.lastName,
              nights:details.nights,
              serviceFee:details.serviceFee,
              paymentDate:details.paymentTime,
              total:details.total
            }
          },
        },
      }
    );
    if (confirmedBooking.modifiedCount === 1) {
      res.status(200).json({ message: "stay booked successfully" });
    } else {
      res.status(400).json({ message: "booking failed" });
    }
  }
};

/// verify payments ///

const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body.response;
  console.log(razorpay_order_id, razorpay_payment_id, razorpay_signature);
  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac("sha256", process.env.KEY_SECRET)
    .update(sign.toString())
    .digest("hex");
  if (razorpay_signature === expectedSign) {
    return res.status(200).json({ message: "Payment verified successfully" ,});
  } else {
    res.status(400).json({ message: "Invalid signature sent !" });
  }
};

/// Show all Bookings ///

const showBookings = async (req, res) => {
  const { id } = req.user;

  const user = await users.findById(id);
  if (user.bookings.length === 0) {
    return res.status(404).json({ message: "No bookings found" });
  }

  const stayIds = user.bookings.map((item) => item.stay);
  const bookingsWithStays = await property
    .find({ _id: { $in: stayIds } })


  const formattedBookings = user.bookings.map((booking) => {
    const stay = bookingsWithStays.find((stay) =>
      stay._id.equals(booking.stay)
    );
    return {
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
      _id:booking._id,
      stay: stay,
      invoiceData:booking.invoiceData,
      guests:booking.guests
    };
  });

  res.status(200).json({ data: formattedBookings });
};

/// Cancel a booking ///

const cancelBooking = async (req, res) => {
  const { id } = req.user;
  const { _id } = req.body;
  const cancel = await users.updateOne(
    { _id: id },
    { $pull: { bookings: { _id: _id } } }
  );
  if (cancel.modifiedCount === 1) {
    res.status(200).json({message:"booking cancellation was successfull"});
  } else {
    res.status(400).json({ error: "Booking not found in your bookings" });
  }
};

/// get curretly booked dates ///

const bookedDates = async (req, res) => {
  const property = req.headers.id;
  const user = await users.find();
  console.log(property);
  const dates = user
    .flatMap((user) =>
      user.bookings.filter((booking) => booking.stay == property)
    )
    .map((booking) => ({
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
    }));

  res.status(200).json({ data: dates });
};

/// get stays by category ///

const stysCategory = async (req,res)=>{
  const category = req.query.stayType

  const properties = await property.find({propertyType:category})
 
  if(properties){
    res.status(200).json({message:"success" ,data:properties})
  }else{
    res.status(400).json({message:"failed"})
  }
}

/// search results ///

const searchResults = async(req,res)=>{
const { keyword } = req.query;
const searchResults = await property.find({
  $or: [
    { propertyType: { $regex: new RegExp(keyword, 'i') } },
    { title: { $regex: new RegExp(keyword, 'i') } },
  ],
});

res.status(200).json({ success: true, results: searchResults });

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
  orderCreate,
  verifyPayment,
  showBookings,
  cancelBooking,
  googleLogin,
  bookedDates,
  stysCategory,
  searchResults
};
