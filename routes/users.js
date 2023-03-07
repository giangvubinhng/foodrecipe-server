const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const middleware = require('../middlewares/auth')

/* GET users listing. */
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", middleware.authenticate, userController.logout);
router.get("/me", middleware.currentUser, userController.getCurrentUser);

module.exports = router;
