import express from 'express'

import providerController from './../controllers/providerController'
import { isLoggedIn, isAuth } from './../middlewares/authMiddleware'
import { isCustomer, isSupperAdmin } from './../middlewares/checkRoleMiddleware'
import { checkConnectDB } from './../middlewares/connectDbMiddleware'
import providerValidation from './../validation/providerValidation'

const providerRouter = express.Router()


providerRouter.get('/list-providers', checkConnectDB, providerController.getListProviders)

providerRouter.post('/register-provider', isAuth, checkConnectDB, isCustomer, providerValidation.registerProvider, providerController.registerProvider)

providerRouter.get('/list-products/:providerId', checkConnectDB, providerController.getListProductsByProvider)

providerRouter.post('/accept-provider', isAuth, checkConnectDB, isSupperAdmin, providerController.acceptProvider)

providerRouter.delete('/remove-provider', isAuth, checkConnectDB, isSupperAdmin, providerController.removeProvider)

module.exports = providerRouter
