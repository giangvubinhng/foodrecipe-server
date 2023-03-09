var db = require('../models/db');
const QUERIES = Object.freeze({
  countIfExists: `SELECT COUNT(*) as itemsCount from User_Favorite Where user_id = ? AND recipe_id = ?`,
})


async function countIfExists(userId, recipeId) {
  return await db.executeQuery(QUERIES.countIfExists, [userId, recipeId])
}


module.exports = {
  countIfExists
}
