const ResponseObject = require('../helpers/ResponseHandler');
const recipeAccessor = require('../accessors/recipe.accessor');
const ingredientAccessor = require('../accessors/ingredient.accessor');
const ratingAccessor = require('../accessors/rating.accessor');
const ingredientRecipeJunctionAccessor = require('../accessors/ingredient_recipe_junction.accessor')
const userFavoriteAccessor = require('../accessors/user_favorite.accessor')
const imageAccessor = require('../accessors/image.accessor')
const { executeTransaction } = require("../models/db");



const ITEMS_PER_PAGE = 20;


async function getPublicRecipes(page) {

  if (isNaN(page) || page < 1)
    page = 1

  const offset = (page - 1) * ITEMS_PER_PAGE;

  const countPromise = recipeAccessor.countPublic()

  const itemsPromise = recipeAccessor.getPublicRecipes(ITEMS_PER_PAGE, offset);

  const promises = [countPromise, itemsPromise]
  return await getRecipesList(promises)

}

async function getWaitListedRecipes(page) {

  if (isNaN(page) || page < 1)
    page = 1

  const offset = (page - 1) * ITEMS_PER_PAGE;

  const countPromise = recipeAccessor.countWaitListedRecipes()

  const itemsPromise = recipeAccessor.getWaitListedRecipes(ITEMS_PER_PAGE, offset);

  const promises = [countPromise, itemsPromise]
  return await getRecipesList(promises)

}

async function getUserRecipes(author_id, user, page) {

  if (isNaN(page) || page < 1)
    page = 1

  const userId = user?.id
  const offset = (page - 1) * ITEMS_PER_PAGE;

  let countPromise;
  let itemsPromise;
  if(!(userId && (userId === author_id || user.role === 1))){
    countPromise = recipeAccessor.countUserRecipesLimit(author_id);
    itemsPromise = recipeAccessor.getUserRecipesLimit(author_id, ITEMS_PER_PAGE, offset);
  }
  else{
    countPromise = recipeAccessor.countUserRecipes(author_id)

    itemsPromise = recipeAccessor.getUserRecipes(author_id, ITEMS_PER_PAGE, offset);
  }


  const promises = [countPromise, itemsPromise]
  return await getRecipesList(promises)

}

async function createRecipe(createRecipeRequestObject) {

  try {
    const transactionLogic = async () => {
      const { name, cuisine, instruction, ingredients, user } = createRecipeRequestObject
      const recipeAction = await recipeAccessor.insert(name, cuisine.toLowerCase(), instruction, user.id);
      const recipeId = Number(recipeAction.insertId)

      for (const ingr of ingredients) {
        let ingredientId = ingr.recipeId;
        if (!ingredientId) {
          const ingredient = ingr.name.toLowerCase();
          const ingredientAction = await ingredientAccessor.insert(ingredient);
          ingredientId = Number(ingredientAction.insertId)
        }
        await ingredientRecipeJunctionAccessor.insert(ingredientId, recipeId)
      }
      return ResponseObject(200, "Recipe created successfully", { recipeId });
    }
    return await executeTransaction(transactionLogic);

  }
  catch (err) {
    console.log(err)
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
    await recipeAccessor.deleteRecipe(recipeId);
    return ResponseObject(200, undefined, { recipeId });
  }
  catch (err) {
    console.log(err);
    return ResponseObject(500);
  }
}

async function getRecipeById(recipeId, user) {
  try {
    const recipes = await recipeAccessor.findById(recipeId);
    if (recipes.length < 1)
      return ResponseObject(400);
    const recipe = recipes[0];
    if (recipe.is_public !== 2 && !(user.id === recipe.user_id || user.role === 1))
      return ResponseObject(403);

    const detailedRecipeObject = await mapDetailedRecipeObject(recipe, user)
    return ResponseObject(200, undefined, { recipe: detailedRecipeObject })
  }
  catch (err) {
    console.log(err);
    return ResponseObject(500);
  }

}

async function mapDetailedRecipeObject(recipe, user) {

  const ingredientsPromise = ingredientAccessor.getIngredients(recipe.id);
  const averageRatingPromise = ratingAccessor.getAverage(recipe.id);
  const recipeImagePromise = imageAccessor.getByRecipeId(recipe.id)
  const promises = [ingredientsPromise, averageRatingPromise, recipeImagePromise]
  let liked = false
  if (user) {
    const userLikedPromise = userFavoriteAccessor.countIfExists(user.id, recipe.id);
    promises.push(userLikedPromise)
  }
  const [ingredients, ratings, images, userLiked] = await Promise.all(promises);
  if (userLiked && userLiked[0].itemsCount > 0)
    liked = true;

  return {
    ...recipe,
    ingredients,
    averageRating: ratings[0].averageRating,
    images,
    liked
  }

}

async function getRecipesList(promises) {

  try {

    const [countRes, items] = await Promise.all(promises);
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
  catch (err) {
    console.log(err)
    return ResponseObject(500)
  }
}

async function addFavRecipe(recipeId, user) {
  // use checkIfFavorited to make sure it returns 0 (recipe not yet favorited)
  const favStatus = await userFavoriteAccessor.checkIfFavorited(user.id, recipeId);
  // if 0, insert into relational table
  if (favStatus["length"] == 0) {
    // insert into relational table
    const addition = await userFavoriteAccessor.addFavRecipe(user.id, Number(recipeId));
    if (addition["warningStatus"] != 0) {
      return ResponseObject(500, undefined, undefined);
    }
    else {
      return ResponseObject(200, undefined, undefined);
    }
  }
  // if 1, error out
  return ResponseObject(400)
}

async function delFavRecipe(recipeId, user) {
  // use checkIfFavorited to make sure it returns 1 (recipe is favorited)
  const favStatus = await userFavoriteAccessor.checkIfFavorited(user.id, recipeId);
  // if 1, remove from relational table
  if (favStatus["length"] == 1) {
    // delete from relational table
    const deletion = await  userFavoriteAccessor.delFavRecipe(user.id, Number(recipeId));
    if (deletion["warningStatus"] != 0) {
      return ResponseObject(500, undefined, undefined);
    }
    else {
      return ResponseObject(200, undefined, undefined);
    }
  }
  // if 0, error out
  return ResponseObject(400)
}

module.exports = {
  getPublicRecipes,
  createRecipe,
  deleteRecipe,
  getRecipeById,
  getUserRecipes,
  getWaitListedRecipes,
  addFavRecipe,
  delFavRecipe
}





