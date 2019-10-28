import sql from 'mssql'

let connectDB = async () => {
    try {
        const pool = await sql.connect(`${process.env.DB_CONNECTION}://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`)
        return pool
    } catch (err) {
        console.error('Failed to connect database, error: ' + err)
    }
}

module.exports = connectDB
