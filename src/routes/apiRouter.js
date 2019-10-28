import express from 'express'
import authRouter from './authRouter'

const apiRouter = express.Router()

apiRouter.use("/auth", authRouter)

module.exports = apiRouter