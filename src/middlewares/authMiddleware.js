import { transError } from './../constants/languageEn'

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

module.exports = {
  isLoggedIn,
  isLoggedOut
}
