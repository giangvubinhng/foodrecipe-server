var db = require('../models/db');
const QUERIES = Object.freeze({
    insertIngredient: `INSERT INTO Ingredient (name) VALUES (?)`
})

async function insertIngredient(newIngredient){
  let connection;
  let response;
  try{
    connection = await db.getConnection();
    const result = await connection.query(QUERIES.insertIngredient, [newIngredient])
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
    insertIngredient
}