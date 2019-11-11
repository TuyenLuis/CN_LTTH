import sql from 'mssql'
import dotenv from 'dotenv'
dotenv.config({ path: process.cwd() + '/sh/.env' })

export const pool = new sql.ConnectionPool({
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST,
  database: process.env.DB_NAME,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  connectionTimeout: 30000,
  requestTimeout: 30000
}).connect()
