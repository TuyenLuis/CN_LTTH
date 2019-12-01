const saveOrderInfo = (req, res, next) => {
  req.session.order = {
    customerId: req.user.Id,
    shipmentPrice: req.body.shipmentPrice || 0,
    customerAddress: req.body.customerAddress,
    customerPhone: req.body.customerPhone,
    listProducts: req.body.listProducts
  }
  next()
}

module.exports = {
  saveOrderInfo
}
