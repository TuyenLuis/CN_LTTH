import _ from 'lodash'
import multer from 'multer'
import fsExtra from 'fs-extra'
import { promisify } from 'util'

import productService from './../services/productService'
import { storageImage } from './../configs/multer'
import config from './../constants/config'
import { transError, transSuccess, transValidation } from './../constants/languageEn'

const NUMBER_PRODUCT_PER_PAGE = 20

// const imageUploadFile = multer({
//   storage: storageImage,
//   limits: {
//     fileSize: config.IMAGE.SIZE
//   }
// }).single('image')

// const imageListUploadFile = multer({
//   storage: storageImage,
//   limits: {
//     fileSize: config.IMAGE.SIZE
//   }
// }).array('imageList', config.IMAGE.LIMIT)

// const imageUpload = promisify(imageUploadFile)
// const imageListUpload = promisify(imageListUploadFile)

const imageUploadFile = multer({
  storage: storageImage,
  limits: {
    fileSize: config.IMAGE.SIZE
  }
}).fields([
  {
    name: 'image',
    maxCount: 1,
  },
  {
    name: 'imageList',
    maxCount: config.IMAGE.LIMIT
  }
])
const imageUpload = promisify(imageUploadFile)

const getListProduct = async (req, res) => {
  try {
    let pageNumber = req.query.page || 1
    let { listProduct, pageAmount } = await productService.getProductPerPage(req.pool, NUMBER_PRODUCT_PER_PAGE, pageNumber)
    listProduct = await Promise.all(_.map(listProduct, async product => {
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
      data: {
        currentPage: +pageNumber,
        pageAmount,
        listProduct
      }
    })
  } catch (err) {
    return res.status(500).send({ err })
  }
}

const addNewProduct = async (req, res) => {
  let errors = []
  try {
    await imageUpload(req, res)
    let skuRegex = /[0-9]$/
    if (!req.body.sku || !skuRegex.test(req.body.sku)) {
      errors.push(transValidation.sku_product)
      return res.status(500).send({ errors })
    }
    if (!req.body.catalogId) {
      errors.push(transValidation.catalog_incorrect)
      return res.status(500).send({ errors })
    }

    let image = `images/${req.files.image[0].filename}`
    let imageList = _.map(req.files.imageList, file => ({
      medium_url: `images/${file.filename}`
    }))
    let discountPrice = req.body.promotionPrice ? (parseFloat(req.body.price) - parseFloat(req.body.promotionPrice)) : null

    let product = {
      sku: req.body.sku || null,
      name: req.body.name || null,
      catalogId: req.body.catalogId || null,
      price: req.body.price || null,
      content: req.body.content || null,
      promotionPrice: req.body.promotionPrice || null,
      amount: req.body.amount || null,
      providerId: req.user.ProviderId || null,
      topFeature: req.body.topFeature || null,
      promotionPercent: discountPrice ? Math.floor(discountPrice * 100 / req.body.price) : null,
      image,
      imageList: JSON.stringify(imageList)
    }

    let productId = await productService.addNewProduct(req.pool, product)
    return res.status(200).send({
      message: transSuccess.add_product_success,
      data: { productId }
    })
  } catch (err) {
    if (err.code === config.ERROR_CODE.LIMIT_UNEXPECTED_FILE) {
      errors.push(transError.limit_file_upload)
    }
    errors.push(err)
    return res.status(500).send({ errors })
  }
}

const removeProduct = async (req, res) => {
  try {
    let productId = req.body.productId
    let providerId = req.user.ProviderId
    await productService.removeProduct(req.pool, productId, providerId)
    return res.status(200).send({
      message: transSuccess.remove_product_success
    })
  } catch (err) {
    return res.status(500).send({ err })
  }
}

const updateProductNormalData = async (req, res) => {
  let errors = []
  let skuRegex = /[0-9]$/
  if (!skuRegex.test(req.body.sku)) {
    errors.push(transValidation.sku_product)
    return res.status(500).send({ errors })
  }
  if (!req.body.productId) {
    errors.push(transValidation.product_incorrect)
    return res.status(500).send({ errors })
  }

  try {
    let discountPrice = req.body.promotionPrice ? (parseFloat(req.body.price) - parseFloat(req.body.promotionPrice)) : null
    let product = {
      sku: req.body.sku || null,
      name: req.body.name || null,
      catalogId: req.body.catalogId || null,
      price: req.body.price || null,
      content: req.body.content || null,
      promotionPrice: req.body.promotionPrice || null,
      amount: req.body.amount || null,
      providerId: req.user.ProviderId || null,
      topFeature: req.body.topFeature || null,
      promotionPercent: discountPrice ? Math.floor(discountPrice * 100 / req.body.price) : null,
      productId: req.body.productId
    }

    await productService.updateProductNormalData(req.pool, product)
    return res.status(200).send({
      message: transSuccess.update_product_success
    })
  } catch (err) {
    errors.push(err)
    return res.status(500).send({ errors })
  }
}

const updateProductExtendsData = async (req, res) => {
  let errors = []
  try {
    await imageUpload(req, res)

    let skuRegex = /[0-9]$/
    let productId = req.body.productId
    if (!skuRegex.test(req.body.sku)) {
      errors.push(transValidation.sku_product)
      return res.status(500).send({ errors })
    }
    if (!productId) {
      errors.push(transValidation.product_incorrect)
      return res.status(500).send({ errors })
    }

    let productData = await productService.getProductDataById(req.pool, productId)
    let productImage = productData.Image
    let productImageList = JSON.parse(productData.ImageList)

    // Remove all image of product
    if (productImage.indexOf('images/') === 0) {
      await fsExtra.remove(`${config.IMAGE.PUBLIC}${productImage}`)
    }
    if (productImageList.length) {
      await Promise.all(_.forEach(productImageList, async image => {
        if (image.medium_url && image.medium_url.indexOf('images/') === 0) {
          await fsExtra.remove(`${config.IMAGE.PUBLIC}${image.medium_url}`)
        }
      }))
    }

    let image = `images/${req.files.image[0].filename}`
    let imageList = _.map(req.files.imageList, file => ({
      medium_url: `images/${file.filename}`
    }))
    let discountPrice = req.body.promotionPrice ? (parseFloat(req.body.price) - parseFloat(req.body.promotionPrice)) : null

    let product = {
      sku: req.body.sku || null,
      name: req.body.name || null,
      catalogId: req.body.catalogId || null,
      price: req.body.price || null,
      content: req.body.content || null,
      promotionPrice: req.body.promotionPrice || null,
      amount: req.body.amount || null,
      providerId: req.user.ProviderId || null,
      topFeature: req.body.topFeature || null,
      promotionPercent: discountPrice ? Math.floor(discountPrice * 100 / req.body.price) : null,
      image,
      imageList: JSON.stringify(imageList),
      productId
    }

    await productService.updateProductExtendsData(req.pool, product)
    return res.status(200).send({
      message: transSuccess.update_product_success
    })
  } catch (err) {
    if (err.code === config.ERROR_CODE.LIMIT_UNEXPECTED_FILE) {
      errors.push(transError.limit_file_upload)
    }
    errors.push(err)
    return res.status(500).send({ errors })
  }
}

const getProductDetailsById = async (req, res) => {
  try {
    let productId = req.params.productId
    if (!productId) {
      return res.status(500).send({ err: transError.product_id_empty })
    }

    let productDetail = await productService.getProductDataById(req.pool, productId)
    if (!productDetail) {
      return res.status(200).send({
        message: transError.product_id_not_existed.replace('#productId', productId),
        data: []
      })
    }

    let listProductLinked = await productService.getProductLinked(req.pool, productDetail.Id)
    let productImage = productDetail.Image
    let productImageList = JSON.parse(productDetail.ImageList)

    productDetail.listProductLinked = listProductLinked
    if (productImage.indexOf('images/') === 0) {
      productDetail.Image = `${config.BACKEND.HOST}${productDetail.Image}`
    }
    if (productImageList.length) {
      productImageList = _.map(productImageList, image => {
        if (image.medium_url && image.medium_url.indexOf('images/') === 0) {
          image.medium_url = `${config.BACKEND.HOST}${image.medium_url}`
        }
        return image
      })
      productDetail.ImageList = [...productImageList]
    }

    return res.status(200).send({
      message: 'success',
      data: productDetail
    })
  } catch (err) {
    return res.status(500).send({ err })
  }
}

module.exports = {
  getListProduct,
  addNewProduct,
  removeProduct,
  updateProductNormalData,
  updateProductExtendsData,
  getProductDetailsById
}
