import express from 'express'

import orderController from './../controllers/orderController'
import { isLoggedIn, isAuth } from './../middlewares/authMiddleware'
import { isCustomer, isAdmin, isSupperAdmin } from './../middlewares/checkRoleMiddleware'
import { checkConnectDB } from './../middlewares/connectDbMiddleware'
import { saveOrderInfo } from './../middlewares/orderMiddleware'

const orderRouter = express.Router()

orderRouter.post('/create-payment', isAuth, checkConnectDB, saveOrderInfo, orderController.createPayment)

orderRouter.get('/vnpay-return', isAuth, checkConnectDB, orderController.getVnPayReturn)

module.exports = orderRouter
