const express = require("express");

const authController = require("../controllers/auth.controller");

const router = express.Router();


//Registering a user
router.post("/register", authController.registerUser);

//Login a user
router.post("/login", authController.loginUser);


router.post("/logout", authController.logoutUser);


module.exports = router;
