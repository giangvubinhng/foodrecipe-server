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
  countPublic: `SELECT COUNT(*) as itemsCount FROM Recipe Where is_public = 2`,
  countUserRecipes: `SELECT COUNT(*) as itemsCount FROM Recipe Where user_id = ?`,
  countUserRecipesLimit: `SELECT COUNT(*) as itemsCount FROM Recipe Where user_id = ? AND is_public = 2`,
  countWaitList: `SELECT COUNT(*) as itemsCount FROM Recipe Where is_public = 1`,
  publicRecipes: `SELECT id, name, cuisine, updated_at, user_id FROM Recipe Where is_public = 2 
                    ORDER BY created_at DESC LIMIT ? OFFSET ?`,
  insert: `INSERT INTO Recipe (name, cuisine, instruction, user_id) VALUES (?, ?, ?, ?)`,
  delete: `DELETE FROM Recipe WHERE id = ?`,
  findById: `SELECT * FROM Recipe WHERE id = ? LIMIT 1`,
  userRecipes: `SELECT id, name, cuisine, updated_at, user_id FROM Recipe Where user_id = ? 
              ORDER BY created_at DESC LIMIT ? OFFSET ?`,
  userRecipesLimit: `SELECT id, name, cuisine, updated_at, user_id FROM Recipe Where user_id = ? and is_public = 2 
              ORDER BY created_at DESC LIMIT ? OFFSET ?`,
  waitListedRecipes: `SELECT id, name, cuisine, updated_at, user_id FROM Recipe Where is_public = 1 
                    ORDER BY created_at DESC LIMIT ? OFFSET ?`,
})

async function countPublic() {
  return await db.executeQuery(QUERIES.countPublic);
}

async function countWaitListedRecipes() {
  return await db.executeQuery(QUERIES.countWaitList);
}

async function countUserRecipes(userId) {
  return await db.executeQuery(QUERIES.countUserRecipes, [userId]);
}
async function countUserRecipesLimit(userId) {
  return await db.executeQuery(QUERIES.countUserRecipesLimit, [userId]);
}

async function getPublicRecipes(limit, offset) {
  return await db.executeQuery(QUERIES.publicRecipes, [limit, offset]);
}
async function getUserRecipes(userId, limit, offset) {
  return await db.executeQuery(QUERIES.userRecipes, [userId, limit, offset]);
}

async function getUserRecipesLimit(userId, limit, offset) {
  return await db.executeQuery(QUERIES.userRecipesLimit, [userId, limit, offset]);
}
async function getWaitListedRecipes(limit, offset) {
  return await db.executeQuery(QUERIES.waitListedRecipes, [limit, offset]);
}

async function insert(name, cuisine, instruction, userId) {
  return await db.executeQuery(QUERIES.insert, [name, cuisine, instruction, userId])
}

//findbyid function -> take recipeId 
async function findById(recipeId) {
  return await db.executeQuery(QUERIES.findById, [recipeId])
}

async function deleteRecipe(recipeId) {
  return await db.executeQuery(QUERIES.delete, [recipeId])
}

module.exports = {
  countPublic,
  getPublicRecipes,
  insert,
  deleteRecipe,
  findById,
  getUserRecipes,
  getWaitListedRecipes,
  countUserRecipes,
  countWaitListedRecipes,
  countUserRecipesLimit,
  getUserRecipesLimit
}
