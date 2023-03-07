var db = require('../models/db');

const QUERIES = Object.freeze({
    insert: `INSERT INTO Ingredient_Recipe_Junction (ingredient_id, recipe_id) VALUES (?, ?)`
})

async function insert(ingredientId, recipeId){
  return await db.executeQuery(QUERIES.insert, [ingredientId, recipeId])
}

module.exports = {
    insert
}
