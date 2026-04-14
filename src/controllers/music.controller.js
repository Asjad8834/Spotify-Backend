const musicModel = require("../models/music.model");
const albumModel = require("../models/album.model");
const jwt = require("jsonwebtoken");
const { uploadFile } = require("../services/storage.service");

async function createMusic(req, res) {
  // we gave id and role in token when we made a user
  // so now we check whether the user is an artist or not based on that token
  /*
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized"
    });
  }

  // decoded might return an error for unauthorized users
  // so to handle that we will place it inside a try and catch block
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "artist") {
      return res.status(403).json({
        message: "You do not have acces to create a music"
      });
    }
      */ // we do mot need the upper part now since we have created a middleware for that, so we will just use that middleware in the routes and remove the upper part from here

    // if user is authorized then we do
    const { title } = req.body;
    const file = req.file;

    const result = await uploadFile(file.buffer.toString("base64"));

    if (!file) {
      return res.status(400).json({
        message: "Music file is required"
      });
    }

    if (!title) {
      return res.status(400).json({
        message: "Title is required"
      });
    }

    const music = await musicModel.create({
      uri: result.url,
      title,
      artist: req.user.id, // we can access the user information from req.user because in the middleware we assigned the decoded token to req.user
    });

    res.status(201).json({
      message: "Music created Succesfully",
      music: {
        id: music.id,
        uri: music.uri,
        title: music.title,
        artist: music.artist,
      }
    });
 /*
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
      error: error.message
    });
  }
    */ // same thing for the catch block we already assigned a middleware
}


async function createAlbum(req, res){
/*
  const token = req.cookies.token;

  if(!token){
    return res.status(401).json({message:"Unauthorized"})
  }

  try{

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if(decoded.role !== "artist"){
      return res.status(403).json({
        message:"You dont have acces to create an album"
      })
    }
*/ //same thing here we have a middleware we can delete ethis upper part
    const {title, musics} = req.body;

    const album = await albumModel.create({
      title,
      artist: req.user.id, ///instead of decoded.id we can also use req.user.id because in the middleware we assigned the decoded token to req.user
      musics: musics
    })

    res.status(201).json({
      message:"Album created Succesfully",
      album:{
        id: album._id,
        title: album.title,
        artist: album.artist,
        musics: album.musics,
      }
    })
/*
  }
  catch(error){
    console.log(error);
    res.status(401).json({message:"Unauthorized"})
  }
*/ //same thing here

}


async function getAllMusics(req, res){
    //also ("artist", "whatever u want to display from artist")
  const musics = await musicModel.find().populate("artist"); 
  //populate is used to get the artist name from the artist id, so we are populating the artist field with the name of the artist; before it was just artist id now we have the detail of the artist also

  res.status(200).json({
    message:"Musics fetched Succesfully",
    musics: musics,
  })

}


async function getAllAlbums(req, res){

  const albums = await albumModel.find().select("title artist -musics").populate("artist", "username email");

  //select is used to select the fields that we want to display, here we are selecting title and artist and we are excluding musics field by using -musics, so musics field will not be displayed in the response; and for artist we are populating only username and email fields(we did -musics because imagine their are 100 songs in an album and their 30 albums that is a lot of overghead that will be displayed on the home screen and it can freeze, so we will display musics not now but later)
  
  
  res.status(200).json({
    message:"Albums fetched Succesfully",
    albums: albums,
  })

}


async function getAlbumById(req, res){

  const albumId = req.params.albumId;

  const album = await albumModel.findById(albumId).populate("artist", "username email").populate("musics");

  return res.status(200).json({
    message:"Album fetched Succesfully",
    album: album,
  })

}



module.exports = { createMusic, createAlbum, getAllMusics, getAllAlbums, getAlbumById };