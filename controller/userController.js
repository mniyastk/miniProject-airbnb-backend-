const users = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const crypto = require("crypto");
const razorpay = require("razorpay");
const property = require("../model/staysModel");
const { OAuth2Client } = require("google-auth-library");

// const asyncHandler = require("../middleware/async");

const googleAuth = async (req, res) => {
  res.headers("Access-Control-Allow-Origin", "http://localhost:3000");
  res.headers("Referrer-Policy", "no-referrer-when-downgrade");
  const redirectUrl = "http://127.0.0.1:3000/oauth";
  const oAuth2Client = new OAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    redirectUrl
  );
  const authorizedUrl = oAuth2Client.generateAuthUrl({
    access_type:"offline",
    scope:"https:/www.googleapis.com/auth/userinfo.profile openid",
    prompt:'consent'
  })
  res.json({url:authorizedUrl})
};
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
            numberOfGuests: details.number_of_guests,
            stay: stay,
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
    return res.status(200).json({ message: "Payment verified successfully" });
  } else {
    res.status(400).json({ message: "Invalid signature sent !" });
  }
};

/// Show all Bookings ///

const showBookings = async (req, res) => {
  const { id } = req.user;

  const user = await users.findById(id);
  if (user.bookings.length === 0) {
    res.status(404).json({ message: "no bookings found" });
  } else {
    const stayIds = user.bookings.map((item) => item.stay);
    const stays = await property.find({ _id: { $in: stayIds } });

    const details = user.bookings.map((book) => {
      const result = stays.find((item) => item._id == book.stay);

      return { ...book, stay: result };
    });
    res.status(200).json({ data: details });
  }
};

/// Cancel a booking ///

const cancelBooking = async (req, res) => {
  const { id } = req.user;
  const { _id } = req.body;
  const cancel = await users.updateOne(
    { _id: id },
    { $pull: { bookings: { stay: _id } } }
  );
  if (cancel.modifiedCount === 1) {
    res.status(204);
  } else {
    res.status(400).json({ error: "Booking not found in your bookings" });
  }
};

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
  googleAuth
};
