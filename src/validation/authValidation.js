import { check } from 'express-validator'
import { transValidation } from './../constants/languageEn'

let register = [
  check('email', transValidation.email_incorrect)
    .isEmail()
    .trim(),
  check('name', transValidation.username_incorrect )
    .matches(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/)
    .isLength({ max: 128, min: 1 })
    .trim(),
  check('address', transValidation.address_incorrect)
    .isLength({ max: 200 }),
  check('password', transValidation.password_incorrect)
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/),
  check('confirmPassword', transValidation.password_confirmation_incorrect)
    .custom((value, { req }) => {
      return value === req.body.password
    }),
  check('phone', transValidation.update_phone)
    .matches(/^(0)[0-9]{9,10}$/)
]

module.exports = {
  register
}
