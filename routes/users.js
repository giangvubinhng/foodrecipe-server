const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

/* GET users listing. */
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/me", userController.getCurrentUser);
router.post("/password/change", userController.changePassword);
router.post("/password/reset/:token", userController.resetPassword)
router.post("/password/send/email", userController.sendForgotPasswordEmail)

module.exports = router;
