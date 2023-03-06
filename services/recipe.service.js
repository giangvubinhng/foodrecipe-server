const ResponseObject = require('../helpers/ResponseHandler');
const recipeAccessor = require('../accessors/recipe.accessor');
const ingredientAccessor = require('../accessors/ingredient.accessor');
const ingredientRecipeJunctionAccessor = require('../accessors/ingredient_recipe_junction.accessor')
const { executeTransaction } = require("../models/db");



const ITEMS_PER_PAGE = 20;


async function getPublicRecipes(publicRecipesRequestObject) {

  let { page } = publicRecipesRequestObject;

  if (page < 1)
    page = 1

  const offset = (page - 1) * ITEMS_PER_PAGE;
  try {
    const countPromise = recipeAccessor.countPublic()

    const itemsPromise = recipeAccessor.getPublicRecipes(ITEMS_PER_PAGE, offset);

    const [countRes, items] = await Promise.all([countPromise, itemsPromise]);
    const count = Number(countRes[0].itemsCount);

    const pageCount = Math.ceil(count / ITEMS_PER_PAGE);
    const data = {
      pagination: {
        count,
        pageCount
      },
      items
    }
    return ResponseObject(200, undefined, data)
  }
  catch (e) {
    console.log(e)
    return ResponseObject(500)
  }
}

async function createRecipe(createRecipeRequestObject) {

  try {
    const transactionLogic = async () => {
      const { name, cuisine, instruction, ingredients, user } = createRecipeRequestObject
      const recipeAction = await recipeAccessor.insert(name, cuisine, instruction, user.id);
      const recipeId = Number(recipeAction.insertId)

      for (const ingr of ingredients) {
        const ingredient = ingr.toLowerCase();
        const ingredientAction = await ingredientAccessor.insert(ingredient);
        const ingredientId = Number(ingredientAction.insertId)

        await ingredientRecipeJunctionAccessor.insert(ingredientId, recipeId)
      }
      return ResponseObject(200, "Recipe created successfully", { recipeId });
    }
    return await executeTransaction(transactionLogic);

  }
  catch (e) {
    console.log(e)
    return ResponseObject(500)
  }
}

async function deleteRecipe(id, user) {
  const recipeId = parseInt(id);
  try {
    const recipes = await recipeAccessor.findById(recipeId);
    if (recipes.length < 1) {
      return ResponseObject(400);
    }
    const recipe = recipes[0];
    if (!(user.role === 1 || recipe.user_id === Number(user.id))) {
      return ResponseObject(400);
    }
    const result = await recipeAccessor.deleteRecipe(recipeId);
    return ResponseObject(200);
  }
  catch (e) {
    console.log(e);
    return ResponseObject(500);
  }
}

async function searchRecipeByName(name) {
  const recipeName = '%' + name + '%';
  try {
    const recipes = await recipeAccessor.findByName(recipeName);
    if (recipes === undefined || recipes.length == 0) {
      return ResponseObject(400, "Recipe Not Found");
    }
    else {
      return ResponseObject(200, "Recipes Found", { recipes });
    }
  } catch (e) {
    console.log(e);
    return ResponseObject(500);
  }
}

module.exports = {
  getPublicRecipes,
  createRecipe,
  deleteRecipe,
  searchRecipeByName
}





