var express = require("express");
var router = express.Router();
const checkAuth = require("../middleware/checkAuth");
const checkAdmin = require("../middleware/checkAdmin");

var BeAuthController = require("../controller/auth/BeUserAuthController");
var AppAuthController = require("../controller/auth/AppAuthController");
var BeUser = require("../controller/User/BeUser");

router.get("/beuser", BeUser.get_all_users);

router.post(
  "/add/beuser",
  checkAuth,
  checkAdmin,
  BeAuthController.register_user
);

router.post("/beuser/login", BeAuthController.login);

router.post(
  "/beuser/firstLogin/:firstLoginToken",
  BeAuthController.first_login
);

router.post("/refreshToken", checkAuth, BeAuthController.get_refresh_token);

router.post("/register/appuser", AppAuthController.register_user);

router.post("/appuser/login", AppAuthController.login);

router.post("/appuser/forgetpassword",AppAuthController.forget_password);
router.post("/appuser/forgetpassword/reset/:token",AppAuthController.forget_password);


module.exports = router;
