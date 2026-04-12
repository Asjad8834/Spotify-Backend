require("dotenv").config();
//uk what u wrote b69db8fbee6bf208e5a7350e4a7581da

const app = require("./src/app");
const connectDB = require("./src/db/db");

connectDB();


app.listen(3000, ()=>{
  console.log("Server Started on Port 3000");
})