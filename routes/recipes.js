const express = require('express');
const recipeController = require('../controllers/recipe.controller');
const middleware = require('../middlewares/auth');
const router = express.Router();



router.get('/', recipeController.getPublicRecipes);
router.post('/', middleware.authenticate ,recipeController.createRecipe);
router.delete('/:id', middleware.authenticate ,recipeController.deleteRecipe);


module.exports = router;


