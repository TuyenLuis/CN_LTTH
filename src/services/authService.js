import sql from 'mssql'

import ultilitiesService from './ultilitiesService'
import { transError } from '../constants/languageEn'

const getCustomerInfo = (customerId, pool) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userResult = await pool.request()
        .input('Id', sql.Int, customerId)
        .query(`
          SELECT C.Id, C.Name, C.Phone, C.Email, C.[Address], C.AccountType, C.[Status], C.RegisteredDate, C.LastLoginDate, P.Id as ProviderId
          FROM dbo.Customers C
          LEFT JOIN dbo.Providers P ON C.Id = P.Owner
          WHERE C.Id = @Id
        `)
      let user = userResult.recordset[0]

      let rolesResult = await pool.request()
        .input('Id', sql.Int, customerId)
        .query(`
          SELECT R.Name FROM dbo.Roles R 
          INNER JOIN dbo.UserRoles UR ON UR.RoleId = R.Id
          INNER JOIN dbo.Customers C ON C.Id = UR.CustomerId
          WHERE C.Id = @Id
        `)
      let roles = rolesResult.recordset
      user = Object.assign({}, user, { roles })
      resolve(user)
    } catch (error) {
      reject(error)
    }
  })
}

const getCustomerByEmail = (pool, email) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userResult = await pool.request()
        .input('Email', sql.VarChar(128), email)
        .query(`
          SELECT * FROM dbo.Customers WHERE Email = @Email
        `)
      resolve(userResult.recordset)
    } catch (error) {
      reject(error)
    }
  })
}

const saveToken = (pool, refreshToken, accessToken) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await pool.request()
        .input('RefreshToken', sql.NVarChar, refreshToken)
        .input('AccessToken', sql.NVarChar, accessToken)
        .execute('prc_Insert_SaveToken')
      resolve(result.recordset)
    } catch (error) {
      reject(error)
    }
  })
}

const getAllToken = pool => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await pool.request()
        .query(`
          SELECT RefreshToken, AccessToken FROM TokenLists
        `)

      let tokenList = {}
      result.recordset.forEach(token => {
        tokenList[token.RefreshToken] = token.AccessToken
      })

      resolve(tokenList)
    } catch (error) {
      reject(error)
    }
  })
}

const updateLastLoggedin = (customerId, pool) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await pool.request()
        .input('Id', sql.Int, customerId)
        .query('UPDATE dbo.Customers SET LastLoginDate = GETDATE() WHERE Id = @Id')

      resolve(result)
    } catch (error) {
      reject(error)
    }
  })
}

const register = ({email, name, password, phone, address}, pool) => {
  return new Promise(async (resolve, reject) => {
    try {
      let checkEmail = await pool.request()
        .input('Email', sql.VarChar(128), email)
        .query(`
          SELECT COUNT(*) AS isExist FROM dbo.Customers WHERE Email = @Email
        `)
      if (checkEmail.recordset[0].isExist) {
        return reject(transError.email_in_used)
      }

      let newCustomer = await pool.request()
        .input('Name', sql.NVarChar(128), name)
        .input('Phone', sql.VarChar(20), phone)
        .input('Email', sql.VarChar(128), email)
        .input('Address', sql.NVarChar(200), address)
        .input('Password', sql.VarChar(100), ultilitiesService.hashPassword(password))
        .output('Id', sql.Int)
        .execute('dbo.prc_Insert_CreateAccountLocal')

      if (newCustomer.output.Id) {
        return resolve(newCustomer.output.Id)
      } else {
        return reject(transError.register_failed)
      }
    } catch (error) {
      return reject(error)
    }
  })
}

module.exports = {
  getCustomerInfo,
  register,
  updateLastLoggedin,
  getCustomerByEmail,
  saveToken,
  getAllToken
}
