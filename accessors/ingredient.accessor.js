var db = require('../models/db');
const QUERIES = Object.freeze({
  insert: `INSERT INTO Ingredient (name) VALUES (?) ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`,
  get: `SELECT * FROM Ingredient
      INNER JOIN Ingredient_Recipe_Junction ON Ingredient.id = Ingredient_Recipe_Junction.ingredient_id
      WHERE Ingredient_Recipe_Junction.recipe_id = ?`,
  find: `SELECT id FROM Ingredient WHERE`

})

async function insert(newIngrendient) {
  return await db.executeQuery(QUERIES.insert, [newIngrendient])
}

async function getIngredients(recipeId) {
  return await db.executeQuery(QUERIES.get, [recipeId])
}

async function filterByRecipes(extra, values){
  return await db.executeDynamicQuery(QUERIES.find, extra, values)

}


module.exports = {
  insert,
  getIngredients,
  filterByRecipes
}
