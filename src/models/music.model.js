const mongoose = require("mongoose");


const musicSchema = new mongoose.Schema({

  uri:{
    type: String,
    required: true,
  },

  title:{
    type: String,
    required: true,
  },

  artist:{
    type: mongoose.Schema.Types.ObjectId, //to get the Id of artist
    ref:"user", //artist is also a user so the users collection name we have to give here
    required: true,
  }

})

const musicModel = mongoose.model("music", musicSchema);


module.exports = musicModel;