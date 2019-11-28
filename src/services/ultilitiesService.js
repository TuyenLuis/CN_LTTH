import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const saltRounds = 7

module.exports = {
  hashPassword: password => {
    const salt = bcrypt.genSaltSync(saltRounds)
    return bcrypt.hashSync(password, salt)
  },
  comparePassword: (password, hashPassword) => {
    return bcrypt.compareSync(password, hashPassword)
  },
  sortObject: obj => {
    let sorted = {}
    let key
    let a = []

    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        a.push(key)
      }
    }

    a.sort()

    for (key = 0; key < a.length; key++) {
      sorted[a[key]] = obj[a[key]]
    }
    return sorted
  },
  generateToken: (user, secretSignature, tokenLife) => {
    return new Promise((resolve, reject) => {
      const userData = user
      jwt.sign(
        { data: userData },
        secretSignature,
        {
          algorithm: "HS256",
          expiresIn: tokenLife,
        },
        (error, token) => {
          if (error) {
            return reject(error)
          }
          resolve(token)
        })
    })
  },
  verifyToken: (token, secretKey) => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secretKey, (error, decoded) => {
        if (error) {
          return reject(error)
        }
        resolve(decoded)
      })
    })
  }
}
