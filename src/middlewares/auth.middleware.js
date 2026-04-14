// we were repeating the cheking token part for both createMusic and createAbumn controllers, so in order to optimize the code we will just use a middleware with the same logic

const jwt = require("jsonwebtoken");


async function authArtist(req, res, next){

  const token = req.cookies.token;

  if(!token){
    return res.status(401).json({message:"Unauthorized"})
  }

  try{

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if(decoded.role !== "artist"){
      return res.status(403).json({
        message:"You do not have access"
      })
    }

    //when all conditions are met we will go to the next operation;

 // we are making a propert req.user and assigning the decoded token to it, so that in the controller we can access the user information from req.user
    req.user = decoded;

    next();

  }
  catch(error){
    return res.status(401).json({message:"Unauthorized"})
  }

}


async function authUser(req, res, next){

  const token = req.cookies.token;

  if(!token){
    return res.status(401).json({message:"Unauthorized"});
  }

  try{

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if(decoded.role !== "user"){
      return res.status(403).json({message:"You dont have access"})
    }

    req.user = decoded;

    next();
  }
  catch(error){
    console.log(error);
    return res.status(401).json({message:"Unauthorized"})
  }

}

module.exports = { authArtist, authUser };