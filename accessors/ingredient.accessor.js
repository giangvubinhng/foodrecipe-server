var db = require('../models/db');
const QUERIES = Object.freeze({
    insert: `INSERT INTO Ingredient (name) VALUES (?)`
})

async function insert(newIngrendient){
  return await db.executeQuery(QUERIES.insert, [newIngrendient])
}


module.exports = {
    insert
}
