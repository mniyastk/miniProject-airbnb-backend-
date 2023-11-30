const users = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
///user registration controller ///

const userRegistration = async (req, res) => {
  const { firstName, lastName, password, email, phone } = req.body.userData;
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
  const { email, password } = req.body;
  const out = await users.findOne({ email });
  if (out) {
    if (await bcrypt.compare(password, out.password)) {
      const token = jwt.sign({ id: out._id }, process.env.USER_SECRET_KEY, {
        expiresIn: "1h",
      });
      res.status(200).json({ message: "login success", token: token });
    } else {
      res.status(401).json({ message: "incorrect Password" });
    }
  } else {
    res.status(401).json({ message: "incorrect email" });
  }
};

module.exports = { userRegistration, userLogin };
