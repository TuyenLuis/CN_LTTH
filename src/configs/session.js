import session from 'express-session'
import sql from 'mssql'
import mssqlStore  from 'mssql-session-store'
import dotenv from 'dotenv'
import connectDB from './connectdb'
import { pool } from './../constants/connection'

dotenv.config({ path: process.cwd() + '/sh/.env'})

const MssqlStore = mssqlStore(session)

/**
 * Config session for app
 * @param app from exactly express module
 */
const config = app => {
  try {
    // await pool
    // console.log(pool)
    app.use(session({
      key: process.env.SESSION_KEY,
      secret: process.env.SESSION_SECRET,
      // store: new MssqlStore({ ttl: 3600, reapInterval: 3600 }), // nếu k cấu hình thì sẽ lưu trên RAM của server
      resave: true,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        secure: false,
        httpOnly: false
      }
    }))
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  config
}
