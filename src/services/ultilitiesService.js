import bcrypt from 'bcrypt'

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
  }
}
