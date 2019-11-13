import sql from 'mssql'

const getListCatalogs = pool => {
  return new Promise(async (resolve, reject) => {
    try {
      let catalogResult = await pool.request()
        .query(`
          SELECT [Id] AS CatalogId
              ,[Name] AS 'Brand'
              ,[Amount] AS 'ProductAmount'
          FROM [dbo].[Catalogs]
          WHERE Visibility = 1
        `)

      resolve(catalogResult.recordset)
    } catch (err) {
      reject(err)
    }
  })
}

const getListProductsByCatalog = (pool, catalogId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let catalogResult = await pool.request()
        .input('CatalogId', sql.Int, catalogId)
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
          WHERE C.Id = @CatalogId AND C.Visibility = 1 AND P.[Status] = 1
        `)

      resolve(catalogResult.recordset)
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = {
  getListCatalogs,
  getListProductsByCatalog
}
