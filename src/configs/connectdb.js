import sql from 'mssql'
import { pool } from './../constants/connection'

let connectDB = async () => {
    try {
        await pool
        return pool
    } catch (err) {
        console.error('Failed to connect database, error: ' + err)
    }
}

module.exports = connectDB
