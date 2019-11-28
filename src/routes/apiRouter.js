import express from 'express'
import authRouter from './authRouter'
import authv2Router from './authv2Router'
import productRouter from './productRouter'
import providerRouter from './providerRouter'
import catalogRouter from './catalogRouter'
import orderRouter from './orderRouter'

const apiRouter = express.Router()

apiRouter.use('/auth', authRouter)
apiRouter.use('/product', productRouter)
apiRouter.use('/provider', providerRouter)
apiRouter.use('/catalog', catalogRouter)
apiRouter.use('/order', orderRouter)
apiRouter.use('/auth/v2', authv2Router)

module.exports = apiRouter
