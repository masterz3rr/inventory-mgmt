const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1d"})
};

//Register User
const registerUser = asyncHandler( async (req, res) => {
  const {name, email, password} = req.body

  //validation
  if(!name || !email || !password){
    res.status(400)
    throw new Error("Please fill in all required fields")
  }

  if(password.length < 6){
    res.status(400)
    throw new Error("Password must be up to 6 characters")
  }

  //check if user email exists already
  const userExist = await User.findOne({email})

  if(userExist){
    res.status(400)
    throw new Error("Email already exists")
  }

  //create new user
  const user = await User.create({
    name,
    email,
    password,
  })

  //generate jwt token
  const token = generateToken(user._id);

  //Send HTTP-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), //1 day 1000 * 86400
    sameSite: "none",
    secure: true
  })

  if(user){
    const {_id, name, email, photo, phone, bio} = user
    res.status(201).json({
        _id, name, email, photo, phone, bio, token,
    })
  } else {
    res.status(400)
    throw new Error("Invalid User Data")
  }
});



//Login User
const loginUser = asyncHandler(async(req, res) => {
  const {email, password} = req.body

  //validation request
  if(!email || !password){
    res.status(400)
    throw new Error("Please fill in all required fields")
  }

  //Check if user exist
  const user = await User.findOne({email})
  if(!user){
    res.status(400)
    throw new Error("User not found, please signup")
  }

  //Check if password is correct
  const passwordCorrect = await bcrypt.compare(password, user.password);
  if(user && passwordCorrect){
    const {_id, name, email, photo, phone, bio} = user
    res.status(200).json({
        _id, name, email, photo, phone, bio,
    })
  } else {
    res.status(400)
    throw new Error("Invalid email/password");
  }
});


module.exports = {
    registerUser,
    loginUser
};