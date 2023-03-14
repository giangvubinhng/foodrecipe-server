var db = require('../models/db');
const QUERIES = Object.freeze({
  countIfExists: `SELECT COUNT(*) as itemsCount from User_Favorite Where user_id = ? AND recipe_id = ?`,
  addFavRecipe: `INSERT INTO User_Favorite (user_id, recipe_id) VALUES (?, ?)`,
  delFavRecipe: `DELETE FROM User_Favorite WHERE user_id = ? AND recipe_id = ?`,
  checkIfFavorited: `SELECT * FROM User_Favorite WHERE user_id = ? AND recipe_id = ?`,
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

async function checkIfFavorited(uid, rid) {
  return await db.executeQuery(QUERIES.checkIfFavorited, [uid, rid])
}


module.exports = {
  countIfExists,
  addFavRecipe,
  delFavRecipe, 
  checkIfFavorited
}
