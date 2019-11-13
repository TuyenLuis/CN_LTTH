import _ from 'lodash'

import catalogService from './../services/catalogService'
import productService from './../services/productService'
import { transError } from './../constants/languageEn'
import config from './../constants/config'

const getListCatalogs = async (req, res) => {
  try {
    let listCatalogs = await catalogService.getListCatalogs(req.pool)
    return res.status(200).send({
      data: listCatalogs
    })
  } catch (err) {
    return res.status(500).send({ err })
  }
}

const getListProductsByCatalog = async (req, res) => {
  try {
    let catalogId = req.params.catalogId
    if (!catalogId) {
      return res.status(500).send({ err: transError.catalog_id_empty })
    }

    let listProducts = await catalogService.getListProductsByCatalog(req.pool, catalogId)
    if (!listProducts || !listProducts.length) {
      return res.status(200).send({
        message: transError.catalog_id_not_existed.replace('#catalogId', catalogId),
        data: []
      })
    }

    listProducts = await Promise.all(_.map(listProducts, async product => {
      let listProductLinked = await productService.getProductLinked(req.pool, product.Id)
      let productImage = product.Image
      let productImageList = JSON.parse(product.ImageList)

      if (productImage.indexOf('images/') === 0) {
        product.Image = `${config.BACKEND.HOST}${product.Image}`
      }
      if (productImageList.length) {
        productImageList = _.map(productImageList, image => {
          if (image.medium_url && image.medium_url.indexOf('images/') === 0) {
            image.medium_url = `${config.BACKEND.HOST}${image.medium_url}`
          }
          return image
        })
        product.ImageList = [...productImageList]
      }
      return Object.assign({}, product, { listProductLinked })
    }))

    return res.status(200).send({
      message: 'success',
      data: listProducts
    })
  } catch (err) {
    return res.status(500).send({ err })
  }
}

module.exports = {
  getListCatalogs,
  getListProductsByCatalog
}
