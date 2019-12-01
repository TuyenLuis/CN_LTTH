import moment from 'moment'
import querystring from 'qs'
import sha256 from 'sha256'

import config from './../constants/config'
import ultilitiesService from './../services/ultilitiesService'
import orderService from './../services/orderService'

let transaction = {}

const createPayment = (req, res) => {
  let ipAddr = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress

  let tmnCode = process.env.vnp_TmnCode
  let secretKey = process.env.vnp_HashSecret
  let vnpUrl = process.env.vnp_Url
  let returnUrl = process.env.vnp_ReturnUrl

  let createDate = moment().format('YYYYMMDDhhmmss')
  let utcTimeStamp = moment.utc().format('YYYYMMDDHHmmss')

  let orderId = moment().format('hhmmss')
  let amount = req.body.amount
  let bankCode = req.body.bankCode || config.VN_PAY_SANDBOX.BANK_CODE

  let orderInfo = req.body.orderDescription || config.VN_PAY_SANDBOX.DESCRIPTION.replace('$timeStamp', moment().format('YYYY-MM-DD hh:mm:ss'))
  let orderType = req.body.orderType || config.VN_PAY_SANDBOX.ORDER_TYPE
  let locale = req.body.language || config.VN_PAY_SANDBOX.LANGUAGE
  let currCode = 'VND'
  let vnpParams = {
    vnp_Version: '2',
    vnp_Command: 'pay',
    vnp_TmnCode: tmnCode,
    vnp_Locale: locale,
    vnp_CurrCode: currCode,
    vnp_TxnRef: orderId,
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: orderType,
    vnp_Amount: amount * 100,
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
    vnp_BankCode: bankCode
  }

  vnpParams = ultilitiesService.sortObject(vnpParams)

  let signData = secretKey + querystring.stringify(vnpParams, { encode: false })
  let secureHash = sha256(signData)

  vnpParams['vnp_SecureHashType'] = 'SHA256'
  vnpParams['vnp_SecureHash'] = secureHash
  vnpUrl += '?' + querystring.stringify(vnpParams, { encode: true })

  transaction[utcTimeStamp] = {
    customerId: req.user.Id,
    shipmentPrice: req.body.shipmentPrice || 0,
    customerAddress: req.body.customerAddress,
    customerPhone: req.body.customerPhone,
    listProducts: req.body.listProducts
  }

  res.status(200).send({ code: '00', data: vnpUrl })
}

const getVnPayReturn = async (req, res) => {
  try {
    let vnpParams = req.query
    let secureHash = vnpParams['vnp_SecureHash']

    delete vnpParams['vnp_SecureHash']
    delete vnpParams['vnp_SecureHashType']

    vnpParams = ultilitiesService.sortObject(vnpParams)

    let secretKey = process.env.vnp_HashSecret
    let signData = secretKey + querystring.stringify(vnpParams, { encode: false })
    let checkSum = sha256(signData)

    if (secureHash === checkSum) {
      const orderTime = vnpParams['vnp_OrderInfo'].slice(vnpParams['vnp_OrderInfo'].indexOf(': ') + 2)
      const time = moment(orderTime).format('YYYYMMDDHHmmss')
      const transactionDetail = transaction[time]

      let orderDetail = {
        customerId: transactionDetail.customerId,
        paymentType: config.PAYMENT_TYPE.ATM,
        shipmentPrice: transactionDetail.shipmentPrice,
        customerAddress: transactionDetail.customerAddress,
        customerPhone: transactionDetail.customerPhone
      }
      let orderItems = transactionDetail.listProducts
      let { orderId } = await orderService.saveOrder(req.pool, orderDetail, orderItems)

      await orderService.createTransaction(req.pool, orderId)

      delete transaction[time]
      return res.status(200).send({ message: 'success' })
    } else {
      return res.status(500).send({ error })
    }
  } catch (error) {
    return res.status(500).send({ error })
  }
}

const createBasicOrder = async (req, res) => {
  try {
    let orderDetail = {
      customerId: req.user.Id,
      paymentType: config.PAYMENT_TYPE.AFTER_RECEIVE,
      shipmentPrice: req.body.shipmentPrice,
      customerAddress: req.body.customerAddress,
      customerPhone: req.body.customerPhone
    }
    let orderItems = req.body.listProducts
    await orderService.saveOrder(req.pool, orderDetail, orderItems)

    return res.status(200).send({ message: 'success' })
  } catch (error) {
    return res.status(500).send({ error })
  }
}

module.exports = {
  createPayment,
  getVnPayReturn,
  createBasicOrder
}
