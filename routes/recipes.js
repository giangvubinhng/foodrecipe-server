const express = require('express');
const recipeController = require('../controllers/recipe.controller');
const router = express.Router();


router.get('/', recipeController.getPublicRecipes);


module.exports = router;


