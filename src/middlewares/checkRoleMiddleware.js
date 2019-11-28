import { transError } from './../constants/languageEn'
import config from './../constants/config'

const isSupperAdmin = (req, res, next) => {
  let isSupperAdmin = req.user.roles.some(item => item.Name === config.ROLES.SUPPER_ADMIN)
  if (isSupperAdmin) {
    next()
  } else {
    return res.status(403).send({ message: transError.permission_denied })
  }
}

const isAdmin = (req, res, next) => {
  let isSupperAdmin = req.user.roles.some(item => item.Name === config.ROLES.ADMIN)
  if (isSupperAdmin) {
    next()
  } else {
    return res.status(403).send({ message: transError.permission_denied })
  }
}

const isCustomer = (req, res, next) => {
  console.log(req.user)
  let isSupperAdmin = req.user.roles.some(item => item.Name === config.ROLES.CUSTOMER)
  if (isSupperAdmin) {
    next()
  } else {
    return res.status(403).send({ message: transError.permission_denied })
  }
}

module.exports = {
  isSupperAdmin,
  isAdmin,
  isCustomer
}
