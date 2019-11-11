import express from 'express'
import authRouter from './authRouter'
import productRouter from './productRouter'
import providerRouter from './providerRouter'

const apiRouter = express.Router()

apiRouter.use('/auth', authRouter)
apiRouter.use('/product', productRouter)
apiRouter.use('/provider', providerRouter)

module.exports = apiRouter
