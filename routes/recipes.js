const express = require('express');
const recipeController = require('../controllers/recipe.controller');
const middleware = require('../middlewares/auth');
const router = express.Router();



router.get('/', recipeController.getPublicRecipes);
router.get('/:id', middleware.currentUser, recipeController.getRecipe);
router.get('/user/:id', middleware.currentUser, recipeController.getUserRecipes);
router.post('/', middleware.authenticate, recipeController.createRecipe);
router.delete('/:id', middleware.authenticate, recipeController.deleteRecipe);
router.post('/addfavrecipe/:rid', middleware.authenticate, recipeController.addFavRecipe);
router.delete('/delfavrecipe/:rid', middleware.authenticate, recipeController.delFavRecipe);


module.exports = router;


