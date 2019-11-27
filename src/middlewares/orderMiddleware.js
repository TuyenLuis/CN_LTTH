const saveOrderInfo = (req, res, next) => {
  req.session.order = {
    customerId: req.user.Id,
    providerId: req.body.providerId,
    shipmentPrice: req.body.shipmentPrice || 0,
    listProducts: req.body.listProducts
  }
  next()
}

module.exports = {
  saveOrderInfo
}
