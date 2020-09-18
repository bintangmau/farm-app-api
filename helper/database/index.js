const { Pool } = require('pg')

const myDatabase = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'farm_app',
    password: 'abc123',
    port: 5432
  })

  module.exports = {
      db: myDatabase
  }