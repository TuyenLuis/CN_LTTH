import passport from 'passport'
import { validationResult } from 'express-validator'

import authService from './../services/authService'
import { transSuccess } from './../constants/languageEn'


const loginLocal = async (req, res, next) => {
  passport.authenticate('local', {
    successFlash: true,
    failureFlash: true
  }, (error, user, info) => {
    if (error) return next(error)
    if (!user) return res.status(401).send({ message: info.message })

    req.logIn(user, err => {
      if (err) return next(err)

      return res.status(200).send({
        message: transSuccess.login_success,
        customer: req.user
      })
    })
  })(req, res, next)
}

const logout = (req, res) => {
  req.logout() // remove session passport user
  return res.status(200).send({
    message: transSuccess.logout_success
  })
}

const register = async (req, res) => {
  const errorArr = []
  const validationErrors = validationResult(req)
  if (!validationErrors.isEmpty()) {
    let errors = Object.values(validationErrors.mapped())
    errors.forEach(err => {
      errorArr.push(err.msg)
    })

    return res.status(500).send({ errorArr })
  }

  try {
    const customerId = await authService.register(req.body, req.pool)
    return res.status(200).send({
      message: transSuccess.register_success,
      customerId
    })
  } catch (err) {
    errorArr.push(err)
    return res.status(500).send({ errorArr })
  }
}

module.exports = {
  loginLocal,
  logout,
  register
}
