const users = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const property = require("../model/staysModel")

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


const showStays = async (req,res)=>{
  try {
    const stays = await property.find()
    res.status(200).json({data:stays})
  } catch (error) {
    res.send(error)
  }


}

/// show a specific Product ///

const specificStay = async (req,res)=>{
const id = req.params.id
  try {
    const stay = await property.findById(id)
    res.status(200).json({
      message:"success",data:stay
    })
  } catch (error) {
    res.send(error)
  }

}



module.exports = { userRegistration, userLogin ,showStays,specificStay};
