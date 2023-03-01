const recipeService = require('../services/recipe.service');


async function getPublicRecipes(req, res){

  const publicRecipeRequestObject = {
    page: req.query.page || 1
  };
  const action = await recipeService.getPublicRecipes(publicRecipeRequestObject);
  return res.status(action.status).json(action.result);

}

async function createRecipe(req, res) {
  const createRecipeRequestObject = req.body;
  createRecipeRequestObject["user"] = req.user;
  const action = await recipeService.createRecipe(createRecipeRequestObject);
  return res.status(action.status).json(action.result);
}

//DELETE 
async function deleteRecipe(req, res) {
  const recipeId = req.params.id;
  const action = await recipeService.deleteRecipe(recipeId);
  return res.status(action.status).json(action.result);
}

module.exports = {
  getPublicRecipes,
  createRecipe,
  deleteRecipe
}
