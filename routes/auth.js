const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registercontrol");
const loginController = require("../controllers/logincontrol");
router.get("/register", registerController.renderRegisterForm);
router.post("/register", registerController.registerUser);
router.get("/login", loginController.renderLoginForm);
router.post("/login", loginController.loginUser);
module.exports = router;
