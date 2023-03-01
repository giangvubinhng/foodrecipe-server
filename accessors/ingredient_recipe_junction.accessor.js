var db = require('../models/db');
const QUERIES = Object.freeze({
    insert: `INSERT INTO Ingredient_Recipe_Junction (ingredient_id, recipe_id) VALUES (?, ?)`
})

async function insert(ingredientId, recipeId){
  let connection;
  let response;
  try{
    connection = await db.getConnection();
    const result = await connection.query(QUERIES.insert, [ingredientId, recipeId])
    response = {
      success: true,
      data: result,
      message: "Operation Succeeded"
    }
    return response;
  }
  catch(e){
    console.error(e)
    response = {
      success: false,
      message: e
    }
    return response;

  }
  finally{
    if (connection) connection.end();
  }
}
module.exports = {
    insert
}