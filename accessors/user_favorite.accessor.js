var db = require('../models/db');
const QUERIES = Object.freeze({
  countIfExists: `SELECT COUNT(*) as itemsCount from User_Favorite Where user_id = ? AND recipe_id = ?`,
  addFavRecipe: `INSERT INTO User_Favorite (recipe_id, user_id) VALUES (?, ?)`,
  delFavRecipe: `DELETE FROM User_Favorite WHERE user_id = ? AND recipe_id = ?`,
})


async function countIfExists(userId, recipeId) {
  return await db.executeQuery(QUERIES.countIfExists, [userId, recipeId])
}

async function addFavRecipe(uid, rid) {
  return await db.executeQuery(QUERIES.addFavRecipe, [uid, rid])
}

async function delFavRecipe(uid, rid) {
  return await db.executeQuery(QUERIES.delFavRecipe, [uid, rid])
}


module.exports = {
  countIfExists,
  addFavRecipe,
  delFavRecipe
}
