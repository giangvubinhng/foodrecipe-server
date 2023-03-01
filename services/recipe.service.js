const { response } = require('express');
const recipeAccessor = require('../accessors/recipe.accessor');



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

module.exports = {
  getPublicRecipes
}




