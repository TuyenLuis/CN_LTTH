import express from 'express'

import providerController from './../controllers/providerController'
import { isLoggedIn } from './../middlewares/authMiddleware'
import { isCustomer, isSupperAdmin } from './../middlewares/checkRoleMiddleware'
import { checkConnectDB } from './../middlewares/connectDbMiddleware'
import providerValidation from './../validation/providerValidation'

const providerRouter = express.Router()


providerRouter.get('/list-providers', isLoggedIn, checkConnectDB, isSupperAdmin, providerController.getListProviders)

providerRouter.post('/register-provider', isLoggedIn, checkConnectDB, isCustomer, providerValidation.registerProvider, providerController.registerProvider)

providerRouter.get('/list-products/:providerId', isLoggedIn, checkConnectDB, isSupperAdmin, providerController.getListProductsByProvider)

module.exports = providerRouter
