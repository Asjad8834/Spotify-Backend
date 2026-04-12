const userModel = require("../models/user.model");

const jwt = require("jsonwebtoken");
//jwt secret is also required and you can go to jwtsecrets.com and acquire that

const bcrypt = require("bcryptjs") //npm i bcryptjs
//we use this for hashing the user password


async function registerUser(req, res){

  const {username, email, password, role="user"} = req.body;

  //checking if the user already exits
  const isUserAlreadyExists = await userModel.findOne({
    
    $or:[
      {username}, {email} //checking if anyine of them is satisfied
    ]
  })

  if(isUserAlreadyExists){
    return res.status(409).json({
      message:"USer already exits"
    })
  }

 //Hashing the user password
  const hash = await bcrypt.hash(password, 10) //10 is the number of rounds/salts we want to do for hashing

  const user = await userModel.create({
    username,
    email,
    password: hash,
    role
  })

 // we have to use a data that is unique while creating a token so user._id is in itself enough

  const token = jwt.sign({
    id: user._id, 
    role: user.role
  }, process.env.JWT_SECRET)

  //now we will send that token and set it in the cookie
  res.cookie("token", token);

  res.status(201).json({
    message:"User registered Succesfully",
    user:{
      id: user._id,
      name: user.username,
      email: user.email,
      role: user.role,
    }
  })

}


async function loginUser(req, res){

  const {username, email, password} = req.body;

  const user = await userModel.findOne({
    $or:[
      {username},
      {email}
    ]
  })

  if(!user){
    return res.status(401).json({
      message:"Invalid Credentials"
    })
  }
                           // one is the password that the user has given and the other we are obtaining from the databse and comapring them 
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if(!isPasswordValid){
    return res.status(401).json({
      message:"Invalid Credentials"
    })
  }

  //when passsword is valid, then we assign it a token

  const token = jwt.sign({
    id: user._id,
    role: user.role,
  }, process.env.JWT_SECRET)

  res.cookie("token", token);


  res.status(200).json({
    message:"User Logged in Succesfully",
    user:{
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    }
  })

}



module.exports = { registerUser, loginUser };
