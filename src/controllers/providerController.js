import { validationResult } from 'express-validator'
import _ from 'lodash'

import providerService from './../services/providerService'
import productService from './../services/productService'
import { transSuccess, transError } from './../constants/languageEn'
import config from './../constants/config'

const getListProviders = async (req, res) => {
  try {
    let listProviders = await providerService.getListProviders(req.pool)
    return res.status(200).send({
      data: listProviders
    })
  } catch (err) {
    return res.status(500).send({ err })
  }
}

const acceptProvider = async (req, res) => {
  try {
    await providerService.acceptProvider(req.pool, req.body.providerId)
    return res.status(200).send({
      message: transSuccess.approve_provider
    })
  } catch (err) {
    return res.status(500).send({ err })
  }
}

const removeProvider = async (req, res) => {
  try {
    await providerService.removeProvider(req.pool, req.body.providerId)
    return res.status(200).send({
      message: transSuccess.delete_provider
    })
  } catch (err) {
    return res.status(500).send({ err })
  }
}

const registerProvider = async (req, res) => {
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
    let provider = {
      name: req.body.name || null,
      phone: req.body.phone || null,
      email: req.body.email || null,
      address: req.body.address || null,
      owner: req.user.Id,
      cardNumber: req.body.cardNumber || null,
      cardDate: req.body.cardDate || null,
      cardHolder: req.body.cardHolder || null,
      bank: req.body.bank || null,
      accountNumber: req.body.accountNumber || null,
      isAllowBusiness: req.body.isAllowBusiness || null,
      businessCode: req.body.businessCode || null
    }

    let providerId = await providerService.registerProvider(req.pool, provider)
    req.user.ProviderId = providerId

    return res.status(200).send({
      message: transSuccess.register_provider_success,
      data: {
        providerId
      }
    })
  } catch (err) {
    errorArr.push(err)
    return res.status(500).send({ errorArr })
  }
}

const getListProductsByProvider = async (req, res) => {
  try {
    let providerId = req.params.providerId
    if (!providerId) {
      return res.status(500).send({ err: transError.provider_id_empty })
    }

    let listProducts = await providerService.getListProductsByProvider(req.pool, providerId)
    if (!listProducts || !listProducts.length) {
      return res.status(200).send({
        message: transError.provider_id_not_existed.replace('#providerId', providerId),
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
  getListProviders,
  registerProvider,
  getListProductsByProvider,
  acceptProvider,
  removeProvider
}
