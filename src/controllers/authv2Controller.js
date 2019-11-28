import ultilitiesService from './../services/ultilitiesService'
import authService from './../services/authService'
import { transError } from './../constants/languageEn'

const accessTokenLife = process.env.ACCESS_TOKEN_LIFE
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET

let login = async (req, res) => {
  try {
    let customerResult = await authService.getCustomerByEmail(req.pool, req.body.email)

    if (!customerResult.length) {
      return res.status(401).send({ message: transError.login_failed })
    }

    let customer = customerResult[0]
    if (customer.Status !== 1) {
      return res.status(401).send({ message: transError.account_non_active })
    }

    let comparePassword = ultilitiesService.comparePassword(req.body.password, customer.Password)
    if (!comparePassword) {
      return res.status(401).send({ message: transError.login_failed })
    }

    let user = await authService.getCustomerInfo(customer.Id, req.pool)
    await authService.updateLastLoggedin(customer.Id, req.pool)
    const accessToken = await ultilitiesService.generateToken(user, accessTokenSecret, accessTokenLife)
    const refreshToken = await ultilitiesService.generateToken(user, refreshTokenSecret, refreshTokenLife)
    await authService.saveToken(req.pool, refreshToken, accessToken)

    return res.status(200).send({
      accessToken,
      refreshToken
    })
  } catch (err) {
    return res.status(500).send({ message: transError.authen_process })
  }
}

let refreshToken = async (req, res) => {
  const refreshTokenFromClient = req.body.refreshToken
  let tokenList = await authService.getAllToken(req.pool)

  if (refreshTokenFromClient && tokenList[refreshTokenFromClient]) {
    try {
      const decoded = await ultilitiesService.verifyToken(refreshTokenFromClient, refreshTokenSecret)
      const user = decoded.data
      const accessToken = await ultilitiesService.generateToken(user, accessTokenSecret, accessTokenLife)

      return res.status(200).send({ accessToken })
    } catch (error) {
      res.status(403).send({
        message: 'Invalid refresh token.'
      })
    }
  } else {
    return res.status(403).send({
      message: 'No token provided.'
    })
  }
}

module.exports = {
  login,
  refreshToken
}
