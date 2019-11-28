import { transError } from './../constants/languageEn'
import ultilitiesService from './../services/ultilitiesService'
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET

const isLoggedIn = (req, res, next) => {
  // passport method
  if (!req.isAuthenticated()) {
    return res.status(401).send({ message: transError.require_login })
  } else {
    next()
  }
}

const isLoggedOut = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.status(403).send({ message: transError.require_logout })
  } else {
    next()
  }
}


const isAuth = async (req, res, next) => {
  const tokenFromClient = req.body.token || req.query.token || req.headers["x-access-token"]
  if (tokenFromClient) {
    try {
      const decoded = await ultilitiesService.verifyToken(tokenFromClient, accessTokenSecret)
      req.user = decoded.data
      next()
    } catch (error) {
      return res.status(401).send({ message: transError.require_login })
    }
  } else {
    return res.status(403).send({
      message: 'No token provided.'
    })
  }
}

module.exports = {
  isLoggedIn,
  isLoggedOut,
  isAuth
}
