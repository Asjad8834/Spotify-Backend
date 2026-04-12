const mongoose = require("mongoose");


const albumnSchema = mongoose.Schema({

  title:{
    type: String,
    required: true,
  },

  musics:[{
    type: mongoose.Schema.Types.ObjectId,
    ref:"music",
  }],

  artist:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"user",
    required: true,
  }

})


const albumModel = new mongoose.model("album", albumnSchema);


module.exports = albumModel;