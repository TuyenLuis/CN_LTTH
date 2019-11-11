import multer from 'multer'
import uuidV4 from 'uuid/v4'

import config from './../constants/config'
import { transError } from './../constants/languageEn'

const storageImage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, config.IMAGE.DIRECTORY)
  },
  filename: (req, file, callback) => {
    const fileMatch = config.IMAGE.TYPE
    if (fileMatch.indexOf(file.mimetype) === -1) {
      return callback(transError.avatar_type, null)
    } else {
      const avatarName = `${Date.now()}-${uuidV4()}-${file.originalname}`
      return callback(null, avatarName)
    }
  }
})

module.exports = {
  storageImage
}
