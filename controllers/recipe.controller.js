const recipeService = require('../services/recipe.service');

async function getPublicRecipes(req, res) {
  const page = req.query.page || 1
  const action = await recipeService.getPublicRecipes(page);
  return res.status(action.status).json(action.result);
}

async function getWaitListedRecipes(req, res) {
  const page = req.query.page || 1
  const action = await recipeService.getWaitListedRecipes(page);
  return res.status(action.status).json(action.result);
}

async function getUserRecipes(req, res) {
  const page = req.query.page || 1
  const author_id = req.params.id;
  const user = req.user
  const action = await recipeService.getUserRecipes(author_id, user, page);
  return res.status(action.status).json(action.result);
}

async function getRecipe(req, res) {
  const id = req.params.id;
  const user = req.user
  const action = await recipeService.getRecipeById(id, user);
  return res.status(action.status).json(action.result);
}


async function createRecipe(req, res) {
  const createRecipeRequestObject = req.body;
  createRecipeRequestObject["user"] = req.user;
  const action = await recipeService.createRecipe(createRecipeRequestObject);
  return res.status(action.status).json(action.result);
}

async function deleteRecipe(req, res) {
  const recipeId = req.params.id;
  const user = req.user;
  const action = await recipeService.deleteRecipe(recipeId, user);
  return res.status(action.status).json(action.result);
}

module.exports = {
  getPublicRecipes,
  createRecipe,
  deleteRecipe,
  getWaitListedRecipes,
  getUserRecipes,
  getRecipe

}
