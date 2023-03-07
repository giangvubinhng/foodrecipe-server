var db = require('../models/db');
const QUERIES = Object.freeze({
  getByRecipeId: `SELECT * FROM Image
      WHERE recipe_id = ?`
})


async function getByRecipeId(recipeId) {
  return await db.executeQuery(QUERIES.getByRecipeId, [recipeId])
}


module.exports = {
  getByRecipeId
}
