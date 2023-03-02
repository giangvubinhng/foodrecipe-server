const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

/* GET users listing. */
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.post("/current-user", userController.getCurrentUser);
router.post("/change-password", userController.changePassword);
router.post("/reset-password/:token", userController.resetPassword)
router.post("/send-reset-password-email", userController.sendForgotPasswordEmail)
router.post("/add-favorite-recipe/users/:userId/recipes/recipeId", userController.addFavRecipe)
router.post("/delete-favorite-recipe/users/:userId/recipes/recipeId", userController.delFavRecipe)

module.exports = router;
