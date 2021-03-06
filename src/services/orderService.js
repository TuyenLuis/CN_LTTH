import sql from 'mssql'
import _ from 'lodash'

import { transError } from './../constants/languageEn'

const saveOrder = (pool, orderDetail, orderItems) => {
  return new Promise(async (resolve, reject) => {
    try {
      let orderResult = await pool.request()
        .input('CustomerId', sql.Int, orderDetail.customerId)
        .input('ProviderId', sql.Int, orderDetail.providerId)
        .input('PaymentType', sql.NVarChar(250), orderDetail.paymentType)
        .input('ShipmentPrice', sql.Decimal(18, 2), orderDetail.shipmentPrice)
        .output('OrderId', sql.Int)
        .execute('prc_Insert_AddNewOrder')

        if (orderResult.output.OrderId) {
          let orderId = orderResult.output.OrderId
          await Promise.all(_.forEach(orderItems, async item => {
            await pool.request()
              .input('OrderId', sql.Int, orderId)
              .input('ProductId', sql.Int, item.productId)
              .input('Quantity', sql.Int, item.quantity)
              .input('Price', sql.Decimal(18, 2), item.price)
              .execute('prc_Insert_AddNewOrderItem')
          }))

          let updateOrderResult = await pool.request()
            .input('OrderId', sql.Int, orderId)
            .output('Total', sql.Decimal(18, 2))
            .execute('prc_Update_UpdateOrderPrice')

          if (updateOrderResult.output.Total) {
            resolve(updateOrderResult.output.Total)
          } else {
            reject(transError.add_order_details)
          }
        } else {
          return reject(transError.add_new_order)
        }
    } catch (error) {
      reject(error)
    }
  })
}

const createTransaction = (pool, transactionDetail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let transResult = await pool.request()
        .input('CustomerId', sql.Int, transactionDetail.customerId)
        .input('ProviderId', sql.Int, transactionDetail.providerId)
        .input('Price', sql.Decimal(18, 2), transactionDetail.price)
        .input('Status', sql.NVarChar(250), transactionDetail.status)

      resolve(transResult.recordset)
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = {
  saveOrder,
  createTransaction
}
