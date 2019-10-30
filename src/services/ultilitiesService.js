import bcrypt from 'bcrypt'

const saltRounds = 7

module.exports = {
  hashPassword: password => {
    const salt = bcrypt.genSaltSync(saltRounds)
    return bcrypt.hashSync(password, salt)
  },
  comparePassword: (password, hashPassword) => {
    return bcrypt.compareSync(password, hashPassword)
  }
}
