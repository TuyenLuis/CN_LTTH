import express from 'express'
import authRouter from './authRouter'
import productRouter from './productRouter'

const apiRouter = express.Router()

apiRouter.use('/auth', authRouter)
apiRouter.use('/product', productRouter)

module.exports = apiRouter
