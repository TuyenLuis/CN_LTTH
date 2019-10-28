import connectDB from './../configs/connectdb'
import sql from 'mssql'

export const checkConnectDB = async (req, res, next) => {
  sql.close()
  if (!req.pool) {
    req.pool = await connectDB()
  }
  next()
}
