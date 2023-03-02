var db = require('../models/db');
/* User Entity
  * ---------------------------
  id int NOT NULL AUTO_INCREMENT,
  email varchar(255) NOT NULL,
  password char(128) NOT NULL,
  first_name varchar(255) NOT NULL,
  last_name varchar(255) NOT NULL,
  role int DEFAULT NULL,
  profile_image varchar(100) NOT NULL,
  verified tinyint(1) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY (email)
  */
const QUERIES = Object.freeze({
  insert: `INSERT INTO User (email, password, first_name, last_name) VALUES (?, ?, ?, ?)`,
  findByEmail: `SELECT * FROM User WHERE email = ?`
})

async function findByEmail(email){
    return await db.executeQuery(QUERIES.findByEmail, [email])
}

async function insert(email, hashPassword, firstName, lastName) {
  return await connection.query(QUERIES.insert, 
    [email, hashPassword,
      firstName, lastName]);
}

module.exports = {
  insert,
  findByEmail
}
