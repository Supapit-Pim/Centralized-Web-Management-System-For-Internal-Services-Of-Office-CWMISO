const express = require("express");
const router = express.Router();
const Login_Controller = require("../controller/login");

router.post("/login", Login_Controller.Login);

module.exports = router;
