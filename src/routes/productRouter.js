import express from 'express'

import productController from './../controllers/productController'
import { isLoggedIn, isAuth } from './../middlewares/authMiddleware'
import { isCustomer, isAdmin, isSupperAdmin } from './../middlewares/checkRoleMiddleware'
import { checkConnectDB } from './../middlewares/connectDbMiddleware'

const productRouter = express.Router()


productRouter.get('/list-product', checkConnectDB, productController.getListProduct)

productRouter.get('/list-catalog', checkConnectDB, productController.getListCatalog)

productRouter.post('/add-new-product', isAuth, checkConnectDB, isAdmin, productController.addNewProduct)

productRouter.delete('/delete-product', isAuth, checkConnectDB, isAdmin, productController.removeProduct)

productRouter.put('/update-product-normal', isAuth, checkConnectDB, isAdmin, productController.updateProductNormalData)

productRouter.put('/update-product-extends', isAuth, checkConnectDB, isAdmin, productController.updateProductExtendsData)

productRouter.get('/product-details/:productId', checkConnectDB, productController.getProductDetailsById)

module.exports = productRouter
