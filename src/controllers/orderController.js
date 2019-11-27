import moment from 'moment'
import querystring from 'qs'
import sha256 from 'sha256'

import config from './../constants/config'
import ultilitiesService from './../services/ultilitiesService'
import orderService from './../services/orderService'

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
    let signData = secretKey + querystring.stringify(vnpParams, { encode: false });
    let checkSum = sha256(signData);

    if (secureHash === checkSum) {
      let orderDetail = {
        customerId: req.session.order.customerId,
        providerId: req.session.order.providerId,
        paymentType: 'Chuyển khoản',
        shipmentPrice: req.session.order.shipmentPrice
      }
      let orderItems = req.session.order.listProducts
      let totalPrice = await orderService.saveOrder(req.pool, orderDetail, orderItems)

      let transactionDetail = {
        customerId: req.session.order.customerId,
        providerId: req.session.order.providerId,
        price: totalPrice,
        status: 'Thành công',
      }
      await orderService.createTransaction(req.pool, transactionDetail)

      delete req.session.order
      return res.status(200).send({ message: 'success' })
    } else {
      return res.status(500).send({ error })
    }
  } catch (error) {
    return res.status(500).send({ error })
  }
}

module.exports = {
  createPayment,
  getVnPayReturn
}
