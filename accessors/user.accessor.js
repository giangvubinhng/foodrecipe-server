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
  let connection;
  let response;
  try{
    connection = await db.getConnection();
    const result = await connection.query(QUERIES.findByEmail, [email])
    response = {
      success: true,
      data: result,
      message: "Users retrieved"
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

async function createUser(user) {

  let connection;
  let response;
  try {
    connection = await db.getConnection();
    const result = await connection.query(QUERIES.insert, 
      [user.email, user.hashedPassword,
        user.firstName, user.lastName]);

    response = {
      success: true,
      data: result,
      message: "User added successfully"

    }
    return response;
  }
  catch (e) {
    console.error(e)
    response = {
      success: false,
      message: e
    }
    return response;
  }
  finally {
    if (connection) connection.end();
  }

}

module.exports = {
  createUser,
  findByEmail
}
