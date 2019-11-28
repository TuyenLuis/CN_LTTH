import express from 'express'

import authv2Controller from './../controllers/authv2Controller'
import { isAuth } from './../middlewares/authMiddleware'
import { checkConnectDB } from './../middlewares/connectDbMiddleware'

const authRouter = express.Router()

authRouter.post('/login', checkConnectDB, authv2Controller.login)

authRouter.post('/refresh-token', checkConnectDB, authv2Controller.refreshToken)

module.exports = authRouter
