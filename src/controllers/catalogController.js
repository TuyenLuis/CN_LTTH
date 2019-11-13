import catalogService from './../services/catalogService'
import { transError } from './../constants/languageEn'

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
    if (!listProducts) {
      return res.status(200).send({
        message: transError.catalog_id_not_existed.replace('#catalogId', catalogId),
        data: []
      })
    }

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
