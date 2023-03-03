var db = require('../models/db');
const QUERIES = Object.freeze({
    insert: `INSERT INTO Ingredient (name) VALUES (?) ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`
})

async function insert(newIngrendient){
  return await db.executeQuery(QUERIES.insert, [newIngrendient])
}


module.exports = {
    insert
}
