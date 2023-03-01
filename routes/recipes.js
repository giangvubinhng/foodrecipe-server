const express = require('express');
const recipeController = require('../controllers/recipe.controller');
const middleware = require('../middlewares/auth');
const router = express.Router();



router.get('/', recipeController.getPublicRecipes);
router.post('/create-recipe', middleware.authenticate ,recipeController.createRecipe);


module.exports = router;


