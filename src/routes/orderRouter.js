import express from 'express'

import orderController from './../controllers/orderController'
import { isLoggedIn, isAuth } from './../middlewares/authMiddleware'
import { isCustomer, isAdmin, isSupperAdmin } from './../middlewares/checkRoleMiddleware'
import { checkConnectDB } from './../middlewares/connectDbMiddleware'
import { saveOrderInfo } from './../middlewares/orderMiddleware'

const orderRouter = express.Router()

orderRouter.post('/create-payment', isAuth, checkConnectDB, isCustomer, saveOrderInfo, orderController.createPayment)

orderRouter.post('/create-order', isAuth, checkConnectDB, isCustomer, orderController.createBasicOrder)

orderRouter.get('/vnpay-return', checkConnectDB, orderController.getVnPayReturn)

module.exports = orderRouter
