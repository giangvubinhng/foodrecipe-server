const express = require('express');
const recipeController = require('../controllers/recipe.controller');
const middleware = require('../middlewares/auth');
const router = express.Router();



router.get('/', recipeController.getPublicRecipes);
router.get('/user/:id', middleware.currentUser, recipeController.getUserRecipes);
router.post('/', middleware.authenticate, recipeController.createRecipe);
router.delete('/:id', middleware.authenticate, recipeController.deleteRecipe);
router.get('/search-recipe', recipeController.searchRecipe);
router.get('/filter-recipe', recipeController.filterRecipeByIngredient);
router.get('/recipe/:id', middleware.currentUser, recipeController.getRecipe);
module.exports = router;


