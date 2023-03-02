const mariadb = require('mariadb')
require('dotenv').config()


const pool = mariadb.createPool({
  host: process.env.DB_HOST || '',
  user: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_SCHEMA || '',
  connectionLimit: 5,
})


async function executeQuery(query, values) {
  let connection;
  try {
    connection = await pool.getConnection();
    const result = await connection.query(query, values)
    return result;
  }
  catch (e) {
    throw new Error(e);
  }
  finally {
    if (connection) connection.end();
  }
}

async function executeTransaction(transactionLogic, retries = 0) {
  let connection;
  let attempt = 0;
  while (attempt <= retries) {
    try {
      connection = await pool.getConnection();
      await connection.beginTransaction();
      const result = await transactionLogic();
      await connection.commit();
      return result;
    } catch (err) {
      if (connection) {
        await connection.rollback()
      }
      console.log(`Transaction failed. Attempt ${attempt + 1}/${retries + 1}. Error: ${err}`);
      attempt++;
      if (attempt > retries) {
        throw new Error(err);
      }
    } finally {
      if (connection) {
        connection.release();
        connection.end();
      }
    }
  }
}

module.exports = { executeQuery, executeTransaction };
