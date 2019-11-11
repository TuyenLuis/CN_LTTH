import sql from 'mssql'
import { transError } from './../constants/languageEn'

const getListProviders = pool => {
  return new Promise(async (resolve, reject) => {
    try {
      let providerResult = await pool.request()
        .query(`
          SELECT
            P.Id,
            P.Name,
            P.Phone,
            P.Email,
            P.[Address],
            P.[Owner] AS 'OwnerId',
            C.Name AS 'OwnerName',
            C.Phone AS 'OwnerPhone',
            C.Email AS 'OwnerEmail',
            C.[Address] AS 'OwnerAddress'
          FROM dbo.Providers P
          INNER JOIN dbo.Customers C ON C.Id = P.[Owner]
        `)

      resolve(providerResult.recordset)
    } catch (error) {
      reject(error)
    }
  })
}

const registerProvider = (pool, provider) => {
  return new Promise(async (resolve, reject) => {
    try {
      let providerResult = await pool.request()
        .input('Name', sql.NVarChar(128), provider.name)
        .input('Phone', sql.VarChar(20), provider.phone)
        .input('Email', sql.VarChar(128), provider.email)
        .input('Address', sql.NVarChar(200), provider.address)
        .input('Owner', sql.Int, provider.owner)
        .input('CardNumber', sql.VarChar(50), provider.cardNumber)
        .input('CardDate', sql.VarChar(10), provider.cardDate)
        .input('CardHolder', sql.VarChar(50), provider.cardHolder)
        .input('Bank', sql.NVarChar(100), provider.bank)
        .input('AccountNumber', sql.VarChar(20), provider.accountNumber)
        .input('isAllowBusiness', sql.Bit, provider.isAllowBusiness)
        .input('BusinessCode', sql.VarChar(10), provider.businessCode)
        .output('Id', sql.Int)
        .execute('prc_Insert_RegisterProvider')

      if (providerResult.output.Id) {
        return resolve(providerResult.output.Id)
      } else {
        return reject(transError.register_provider)
      }
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = {
  getListProviders,
  registerProvider
}
