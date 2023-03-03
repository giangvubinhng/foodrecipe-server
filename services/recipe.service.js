const ResponseObject = require('../helpers/ResponseHandler');
const recipeAccessor = require('../accessors/recipe.accessor');
const ingredientAccessor = require('../accessors/ingredient.accessor');
const ingredientRecipeJunctionAccessor = require('../accessors/ingredient_recipe_junction.accessor')
const {executeTransaction} = require("../models/db");



const ITEMS_PER_PAGE = 20;


async function getPublicRecipes(publicRecipesRequestObject){

  const {page} = publicRecipesRequestObject;

  const offset = (page - 1) * ITEMS_PER_PAGE;
  try{
    const countPromise = recipeAccessor.countPublic()

    const itemsPromise = recipeAccessor.getPublicRecipes(ITEMS_PER_PAGE, offset);

    const [countRes, items] = await Promise.all([countPromise, itemsPromise]);
    const count = Number(countRes[0].itemsCount);
    
    const pageCount = count / ITEMS_PER_PAGE;
    const data = {
      pagination: {
        count,
        pageCount
      },
      items
    }
    return ResponseObject(200, undefined, data)
  }
  catch(e){
    console.log(e)
    return ResponseObject(500)
  }
}

async function createRecipe(createRecipeRequestObject){

  try{
    const transactionLogic = async () => {
      const {name, cuisine, instruction, ingredients, user} = createRecipeRequestObject
      const recipeAction = await recipeAccessor.insert(name, cuisine, instruction, user.id);
      const recipeId = Number(recipeAction.insertId)

      for (const ingr of ingredients){
        const ingredient = ingr.toLowerCase();
        const ingredientAction = await ingredientAccessor.insert(ingredient);
        const ingredientId = Number(ingredientAction.insertId)

        await ingredientRecipeJunctionAccessor.insert(ingredientId, recipeId)
      }
      return ResponseObject(200, "Recipe created successfully", {recipeId});
    }
    return await executeTransaction(transactionLogic);

  }
  catch(e){
    console.log(e)
    return ResponseObject(500)
  }
}

async function deleteRecipe(id, user) {
  console.log(id)
  const recipeId = parseInt(id);
  const result = await recipeAccessor.deleteRecipe(recipeId, user);
  if (!result.success) {
    return {
      result: {
        success: false,
        message: "An error has occurred, please try again later",
      },
      status: 500,
    }
  }
  return {
    result: {
      success: true,
      data: recipeId,
      message: "Deleted successfully",
    },
    status: 200
  }
}

module.exports = {
  getPublicRecipes,
  createRecipe,
  deleteRecipe
}




 
