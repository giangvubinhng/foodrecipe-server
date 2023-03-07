var db = require('../models/db');
const QUERIES = Object.freeze({
  getAverage: `SELECT AVG(Rating.rating) as averageRating FROM Rating
      WHERE Rating.recipe_id = ?`
})


async function getAverage(recipeId) {
  return await db.executeQuery(QUERIES.getAverage, [recipeId])
}


module.exports = {
  getAverage
}
