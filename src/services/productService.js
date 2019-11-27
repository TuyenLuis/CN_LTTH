import sql from 'mssql'

import { transError } from './../constants/languageEn'

const getProductPerPage = (pool, pageSize, pageNumber = 1) => {
  return new Promise(async (resolve, reject) => {
    try {
      let productResult = await pool.request()
      .input('pageSize', sql.Int, pageSize)
      .input('pageNumber', sql.Int, pageNumber)
      .output('pageAmount', sql.Int)
      .execute('dbo.prc_Select_GetListProductPaging')

      resolve({
        listProduct: productResult.recordset,
        pageAmount: productResult.output.pageAmount
      })
    } catch (error) {
      reject(error)
    }
  })
}

const getListCatalog = pool => {
  return new Promise(async (resolve, reject) => {
    try {
      let catalogResult = await pool.request()
      .query(`
        SELECT
          Id,
          Name,
          Amount
        FROM Catalogs
        WHERE [Visibility] = 1
      `)

      resolve(catalogResult.recordset)
    } catch (error) {
      reject(error)
    }
  })
}

const getProductLinked = (pool, productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let productResult = await pool.request()
      .input('ProductId', sql.Int, productId)
      .query(`
        SELECT TOP 10
          P.Id
          ,P.Name
          ,P.Price
          ,P.PromotionPrice
          ,P.PromotionPercent
          ,P.[Image]
        FROM dbo.ProductLinks PL
        INNER JOIN dbo.Products P ON P.Id = PL.LinkedProductId
        WHERE PL.ProductId = @ProductId
        ORDER BY P.[PublishDate] DESC
      `)

      resolve(productResult.recordset)
    } catch (error) {
      reject(error)
    }
  })
}

const getProductDataById = (pool, productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let productResult = await pool.request()
      .input('ProductId', sql.Int, productId)
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
        WHERE P.Id = @ProductId AND C.Visibility = 1 AND P.[Status] = 1
      `)

      resolve(productResult.recordset[0])
    } catch (error) {
      reject(error)
    }
  })
}

const addNewProduct = (pool, product) => {
  return new Promise(async (resolve, reject) => {
    try {
      let productResult = await pool.request()
        .input('SKU', sql.VarChar(20), product.sku)
        .input('Name', sql.NVarChar(128), product.name)
        .input('CatalogId', sql.Int, product.catalogId)
        .input('Content', sql.NText, product.content)
        .input('Price', sql.Decimal(18, 2), product.price)
        .input('PromotionPrice', sql.Decimal(18, 2), product.promotionPrice)
        .input('Image', sql.NVarChar(250), product.image)
        .input('ImageList', sql.NVarChar, product.imageList)
        .input('Amount', sql.Int, product.amount)
        .input('ProviderId', sql.Int, product.providerId)
        .input('PromotionPercent', sql.Float, product.promotionPercent)
        .input('TopFeature', sql.NText, product.topFeature)
        .output('Id', sql.Int)
        .execute('dbo.prc_Insert_AddNewProduct')

        if (productResult.output.Id) {
          return resolve(productResult.output.Id)
        } else {
          return reject(transError.add_product)
        }
    } catch (error) {
      reject(error)
    }
  })
}

const removeProduct = (pool, productId, providerId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let productResult = await pool.request()
        .input('ProductId', sql.Int, productId)
        .input('ProviderId', sql.Int, providerId)
        .query(`
          UPDATE Products SET [Status] = 0
          WHERE Id = @ProductId AND ProviderId = @ProviderId
        `)

      resolve(productResult)
    } catch (error) {
      reject(error)
    }
  })
}

const updateProductNormalData = (pool, product) => {
  return new Promise(async (resolve, reject) => {
    try {
      let productResult = await pool.request()
        .input('SKU', sql.VarChar(20), product.sku)
        .input('Name', sql.NVarChar(128), product.name)
        .input('CatalogId', sql.Int, product.catalogId)
        .input('Content', sql.NText, product.content)
        .input('Price', sql.Decimal(18, 2), product.price)
        .input('PromotionPrice', sql.Decimal(18, 2), product.promotionPrice)
        .input('Amount', sql.Int, product.amount)
        .input('ProviderId', sql.Int, product.providerId)
        .input('PromotionPercent', sql.Float, product.promotionPercent)
        .input('TopFeature', sql.NText, product.topFeature)
        .input('ProductId', sql.Int, product.productId)
        .execute('dbo.prc_Update_UpdateProductNormal')

        return resolve(productResult)
    } catch (error) {
      return reject(error)
    }
  })
}

const updateProductExtendsData = (pool, product) => {
  return new Promise(async (resolve, reject) => {
    try {
      let productResult = await pool.request()
        .input('SKU', sql.VarChar(20), product.sku)
        .input('Name', sql.NVarChar(128), product.name)
        .input('CatalogId', sql.Int, product.catalogId)
        .input('Content', sql.NText, product.content)
        .input('Price', sql.Decimal(18, 2), product.price)
        .input('PromotionPrice', sql.Decimal(18, 2), product.promotionPrice)
        .input('Image', sql.NVarChar(250), product.image)
        .input('ImageList', sql.NVarChar, product.imageList)
        .input('Amount', sql.Int, product.amount)
        .input('ProviderId', sql.Int, product.providerId)
        .input('PromotionPercent', sql.Float, product.promotionPercent)
        .input('TopFeature', sql.NText, product.topFeature)
        .input('ProductId', sql.Int, product.productId)
        .execute('dbo.prc_Update_UpdateProductExtends')

        return resolve(productResult)
    } catch (error) {
      return reject(error)
    }
  })
}


module.exports = {
  getProductPerPage,
  getProductLinked,
  addNewProduct,
  removeProduct,
  updateProductNormalData,
  getProductDataById,
  updateProductExtendsData,
  getListCatalog
}
