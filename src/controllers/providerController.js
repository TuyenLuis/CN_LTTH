import providerService from './../services/providerService'
import { validationResult } from 'express-validator'

import { transSuccess, transError } from './../constants/languageEn'

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

module.exports = {
  getListProviders,
  registerProvider
}
