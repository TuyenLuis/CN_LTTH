import express from 'express'

import productController from './../controllers/productController'
import { isLoggedIn } from './../middlewares/authMiddleware'
import { isCustomer, isAdmin, isSupperAdmin } from './../middlewares/checkRoleMiddleware'
import { checkConnectDB } from './../middlewares/connectDbMiddleware'

const productRouter = express.Router()


productRouter.get('/list-product', checkConnectDB, productController.getListProduct)

productRouter.post('/add-new-product', isLoggedIn, checkConnectDB, isAdmin, productController.addNewProduct)

productRouter.delete('/delete-product', isLoggedIn, checkConnectDB, isAdmin, productController.removeProduct)

productRouter.put('/update-product-normal', isLoggedIn, checkConnectDB, isAdmin, productController.updateProductNormalData)

productRouter.put('/update-product-extends', isLoggedIn, checkConnectDB, isAdmin, productController.updateProductExtendsData)

productRouter.get('/product-details/:productId', checkConnectDB, productController.getProductDetailsById)

module.exports = productRouter
