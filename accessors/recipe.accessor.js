var db = require('../models/db');
/**
  * Recipe Entity
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    cuisine varchar(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    instruction TEXT,
    is_public tinyint(1) NOT NULL,
    user_id int,
    PRIMARY KEY (id),
    CONSTRAINT fk_user 
      FOREIGN KEY (user_id) REFERENCES User (id) ON DELETE CASCADE ON UPDATE CASCADE
  */
const QUERIES = Object.freeze({
  getPublicCount: `SELECT COUNT(*) as itemsCount from Recipe Where is_public = 1`,
  getPublicRecipes: `SELECT * from Recipe Where is_public = 1 ORDER BY created_at DESC LIMIT ? OFFSET ?`,
  insertRecipe: `INSERT INTO Recipe (name, cuisine, instruction, user_id) VALUES (?, ?, ?, ?)`,
  deleteRecipe: `DELETE FROM Recipe WHERE id = ? AND user_id = ?`,
  adminDelete:  `DELETE FROM Recipe WHERE id = ?`
})

async function getPublicRecipesCount(){
  let connection;
  let response;
  try{
    connection = await db.getConnection();
    const result = await connection.query(QUERIES.getPublicCount)
    response = {
      success: true,
      data: result[0].itemsCount,
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


async function getPublicRecipes(limit, offset){
  let connection;
  let response;
  try{
    connection = await db.getConnection();
    const result = await connection.query(QUERIES.getPublicRecipes, [limit, offset])
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

async function insertRecipe(newRecipe){
  let connection;
  let response;
  try{
    const {name, cuisine, instruction, user} = newRecipe
    const userId = user.id
    connection = await db.getConnection();
    const result = await connection.query(QUERIES.insertRecipe, [name, cuisine, instruction, userId])
    

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

async function deleteRecipe(reId, user) {
  let connection;
  let response;
  try{
    const userId = user.id
    connection = await db.getConnection();
    let result;
    if (user.role == 1) {
      result = await connection.query(QUERIES.adminDelete, [reId])
    }
    else {
      result = await connection.query(QUERIES.deleteRecipe, [reId, userId])
    }
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
  getPublicRecipesCount,
  getPublicRecipes,
  insertRecipe,
  deleteRecipe

}
