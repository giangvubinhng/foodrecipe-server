const { response } = require('express');
const recipeAccessor = require('../accessors/recipe.accessor');
const ingredientAccessor = require('../accessors/ingredient.accessor');
const ingredientRecipeJunctionAccessor = require('../accessors/ingredient_recipe_junction.accessor')



const ITEMS_PER_PAGE = 20;


async function getPublicRecipes(publicRecipesRequestObject){

  const {page} = publicRecipesRequestObject;

  const offset = (page - 1) * ITEMS_PER_PAGE;

  const countPromise = recipeAccessor.getPublicRecipesCount()

  const itemsPromise = recipeAccessor.getPublicRecipes(ITEMS_PER_PAGE, offset);

  const [countRes, itemsRes] = await Promise.all([countPromise, itemsPromise])

  if(!(countRes.success && itemsRes.success)){

    return {
      result: {
        success: false,
        message: "An error has occurred, please try again later",
      },
      status: 500,
    }

  }
  const count = Number(countRes.data);
  const items = itemsRes.data;


  const pageCount = count / ITEMS_PER_PAGE;

  return {
    result: {
      success: true,
      data: {
        pagination: {
          count,
          pageCount
        },
        items
      },
      messaage: "Public recipe retrieved successfully",
    },
    status: 200
  }
}

async function createRecipe(createRecipeRequestObject) {
  const recipeAction = await recipeAccessor.insertRecipe(createRecipeRequestObject)
  if(!recipeAction.success){
    return {
      result: {
        success: false,
        message: "An error has occurred, please try again later",
      },
      status: 500,
    }
  }
  const recipeId = Number(recipeAction.data.insertId)

  const ingredientList = createRecipeRequestObject.ingredients;

  for (const ingredient of ingredientList){
    const ingredientAction = await ingredientAccessor.insertIngredient(ingredient);
    if(!ingredientAction.success){
      return {
        result: {
          success: false,
          message: "An error has occurred, please try again later",
        },
        status: 500,
      }
    }
    
    const ingredientId = Number(ingredientAction.data.insertId)
    const result = await ingredientRecipeJunctionAccessor.insert(ingredientId, recipeId)

    if(!result.success){
      return {
        result: {
          success: false,
          message: "An error has occurred, please try again later",
        },
        status: 500,
      }
    }
  }
  return {
    result: {
      success: true,
      data: recipeId,
      message: "Public recipe retrieved successfully",
    },
    status: 200
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




 