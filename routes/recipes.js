const express = require('express');
const recipeController = require('../controllers/recipe.controller');
const middleware = require('../middlewares/auth');
const router = express.Router();



router.get('/', recipeController.getPublicRecipes);
router.post('/create-recipe', middleware.authenticate, recipeController.createRecipe);
//DELETE
router.delete('/delete-recipe/:id', middleware.authenticate, recipeController.deleteRecipe);

router.get('/search-recipe', recipeController.searchRecipe);
router.get('/filter-recipe', recipeController.filterRecipeByRecipe);
module.exports = router;


