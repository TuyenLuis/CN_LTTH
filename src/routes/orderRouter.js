import express from 'express'

import orderController from './../controllers/orderController'
import { isLoggedIn } from './../middlewares/authMiddleware'
import { isCustomer, isAdmin, isSupperAdmin } from './../middlewares/checkRoleMiddleware'
import { checkConnectDB } from './../middlewares/connectDbMiddleware'
import { saveOrderInfo } from './../middlewares/orderMiddleware'

const orderRouter = express.Router()

orderRouter.post('/create-payment', isLoggedIn, checkConnectDB, saveOrderInfo, orderController.createPayment)

orderRouter.get('/vnpay-return', isLoggedIn, checkConnectDB, orderController.getVnPayReturn)

module.exports = orderRouter
