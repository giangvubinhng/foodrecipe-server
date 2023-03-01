const recipeService = require('../services/recipe.service');


async function getPublicRecipes(req, res){

  const publicRecipeRequestObject = {
    page: req.query.page || 1
  };
  const action = await recipeService.getPublicRecipes(publicRecipeRequestObject);
  return res.status(action.status).json(action.result);

}

module.exports = {
  getPublicRecipes
}
