var express = require('express');
var router = express.Router();
var userController = require('../controllers/user.controller');

/* GET users listing. */
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/verify/:token", userController.verify);
router.post("/current-user", userController.getCurrentUser);
router.post("/change-password", userController.changePassword);
router.post("/reset-password/:token", userController.resetPassword)
router.post("/send-reset-password-email", userController.sendForgotPasswordEmail)

module.exports = router;
