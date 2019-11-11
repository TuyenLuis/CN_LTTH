import express from 'express'
import passport from 'passport'

import initPassportLocal from './../controllers/passportController/local'
import authController from './../controllers/authController'
import { isLoggedIn, isLoggedOut } from './../middlewares/authMiddleware'
import { checkConnectDB } from './../middlewares/connectDbMiddleware'
import authValidation from './../validation/authValidation'

initPassportLocal()

const authRouter = express.Router()


authRouter.post('/login', isLoggedOut, checkConnectDB, authController.loginLocal)

authRouter.get('/login', (req, res) => {
  res.send("Test API GET login")
})

authRouter.get('/logout', isLoggedIn, checkConnectDB, authController.logout)

authRouter.post('/register', isLoggedOut, checkConnectDB, authValidation.register, authController.register)

module.exports = authRouter
