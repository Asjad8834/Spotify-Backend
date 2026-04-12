const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");
const musicRoutes = require("./routes/music.routes")

//Middleware
app.use(express.json())
app.use(cookieParser());


app.use("/api/auth", authRoutes);

app.use("/api/music", musicRoutes);


module.exports = app;