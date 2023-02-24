const mariadb = require('mariadb')
require('dotenv').config()


const connection = mariadb.createPool({
  host: process.env.DB_HOST || '',
  user: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || '', 
  connectionLimit: 5,
})

module.exports = connection;
