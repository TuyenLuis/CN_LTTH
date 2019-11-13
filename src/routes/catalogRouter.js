import express from 'express'

import catalogController from './../controllers/catalogController'
import { isLoggedIn } from './../middlewares/authMiddleware'
import { isCustomer, isSupperAdmin } from './../middlewares/checkRoleMiddleware'
import { checkConnectDB } from './../middlewares/connectDbMiddleware'

const catalogRouter = express.Router()

catalogRouter.get('/list-catalogs', checkConnectDB, catalogController.getListCatalogs)

catalogRouter.get('/list-products/:catalogId', checkConnectDB, catalogController.getListProductsByCatalog)

module.exports = catalogRouter
