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
  countPublic: `SELECT COUNT(*) as itemsCount from Recipe Where is_public = 1`,
  publicRecipes: `SELECT * from Recipe Where is_public = 1 ORDER BY created_at DESC LIMIT ? OFFSET ?`,
  insert: `INSERT INTO Recipe (name, cuisine, instruction, user_id) VALUES (?, ?, ?, ?)`,
  delete: `DELETE FROM Recipe WHERE id = ?`,
  findbyid: `SELECT * FROM Recipe WHERE id = ?`
})

async function countPublic(){
  return await db.executeQuery(QUERIES.countPublic);
}

async function getPublicRecipes(limit, offset){
  return await db.executeQuery(QUERIES.publicRecipes, [limit, offset]);
}

async function insert(name, cuisine, instruction, userId){
  return await db.executeQuery(QUERIES.insert, [name, cuisine, instruction, userId])
}

//findbyid function -> take recipeId 
async function findById(recipeId){
  return await db.executeQuery(QUERIES.findbyid, [recipeId])
}

async function deleteRecipe(recipeId){
  return await db.executeQuery(QUERIES.delete, [recipeId])
}

module.exports = {
  countPublic,
  getPublicRecipes,
  insert,
  deleteRecipe,
  findById
}
