import passport from 'passport'
import passportLocal from 'passport-local'
import sql from 'mssql'

import connectDB from './../../configs/connectdb'
import authService from './../../services/authService'
import ultilitiesService from './../../services/ultilitiesService'
import { transError, transSuccess } from './../../constants/languageEn'

const LocalStrategy = passportLocal.Strategy
/**
 * Valid user account type: Local
 */
const initPassportLocal = async () => {
  let pool = null
  passport.use(new LocalStrategy({
    usernameField: 'email', // this field from name of form login
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, email, password, done) => {
    try {
      pool = req.pool
      let customerResult = await req.pool.request()
        .input('Email', sql.VarChar(128), email)
        .query(`
          SELECT * FROM dbo.Customers WHERE Email = @Email
        `)

      if (!customerResult.recordset.length) {
        return done(null, false, { message: transError.login_failed })
      }

      let customer = customerResult.recordset[0]
      if (customer.Status !== 1) {
        return done(null, false, { message: transError.account_non_active })
      }

      let comparePassword = ultilitiesService.comparePassword(password, customer.Password)
      if (!comparePassword) {
        return done(null, false, { message: transError.login_failed })
      }

      let user = await authService.getCustomerInfo(customer.Id, req.pool)
      await authService.updateLastLoggedin(customer.Id, req.pool)
      return done(null, user, { message: transSuccess.login_success })
    } catch (err) {
      console.log(err)
      return done(null, false, { message: transError.authen_process })
    }
  }))

  // Save customer Id to session
  passport.serializeUser((user, done) => {
    done(null, user.Id)
  })

  // passport.session() in app.js call deserializeUser to get customerId
  // return user to req.user
  passport.deserializeUser(async (userId, done) => {
    try {
      let user = await authService.getCustomerInfo(userId, pool)
      return done(null, user)
    } catch (error) {
      return done(error, null)
    }
  })
}

module.exports = initPassportLocal
