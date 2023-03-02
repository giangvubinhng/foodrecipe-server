const mariadb = require('mariadb')
require('dotenv').config()


const pool = mariadb.createPool({
  host: process.env.DB_HOST || '',
  user: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_SCHEMA || '', 
  connectionLimit: 5,
})


async function executeQuery(query, values){
  let connection;
  try{
    connection = await pool.getConnection();
    const result = await connection.query(query, values)
    return result;
  }
  catch(e){
    throw new Error(e);
  }
  finally{
    if (connection) connection.end();
  }
}

module.exports = {executeQuery};
