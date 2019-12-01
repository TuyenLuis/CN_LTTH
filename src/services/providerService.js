import sql from 'mssql'
import { transError } from './../constants/languageEn'
import config from './../constants/config'

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
            C.[Address] AS 'OwnerAddress',
            P.[Status]
          FROM dbo.Providers P
          INNER JOIN dbo.Customers C ON C.Id = P.[Owner]
        `)

      resolve(providerResult.recordset)
    } catch (error) {
      reject(error)
    }
  })
}


const acceptProvider = (pool, providerId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await pool.request()
        .input('ProviderId', sql.Int, providerId)
        .query(`
          UPDATE Providers SET [Status] = ${config.PROVIDER_STATUS.APPROVED}
          WHERE Id = @ProviderId
        `)

      resolve(result)
    } catch (error) {
      reject(error)
    }
  })
}

const removeProvider = (pool, providerId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await pool.request()
        .input('ProviderId', sql.Int, providerId)
        .query(`
          UPDATE Providers SET [Status] = ${config.PROVIDER_STATUS.DELETED}
          WHERE Id = @ProviderId
        `)

      resolve(result)
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

const getListProductsByProvider = (pool, providerId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let catalogResult = await pool.request()
        .input('ProviderId', sql.Int, providerId)
        .query(`
          SELECT P.[Id]
              ,P.[SKU]
              ,P.[Name]
              ,P.[CatalogId]
              ,P.[Content]
              ,P.[Price]
              ,P.[PromotionPrice]
              ,P.[Image]
              ,P.[ImageList]
              ,P.[Status]
              ,P.[Amount]
              ,P.[ProviderId]
              ,P.[PromotionPercent]
              ,P.[TopFeature]
              ,P.[PublishDate]
              ,C.[Name] AS 'Brand'
              ,pv.[Name] AS 'Provider'
              ,pv.[Email] AS 'ProviderEmail'
              ,pv.[Phone] AS 'ProviderPhone'
              ,pv.[Address] AS 'ProviderAddress'
          FROM dbo.Products P
          INNER JOIN dbo.Catalogs C ON C.Id = P.CatalogId
          LEFT JOIN dbo.Providers Pv ON Pv.Id = P.ProviderId
          WHERE Pv.Id = @ProviderId AND C.Visibility = 1 AND P.[Status] = 1
        `)

      resolve(catalogResult.recordset)
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = {
  getListProviders,
  registerProvider,
  getListProductsByProvider,
  acceptProvider,
  removeProvider
}
