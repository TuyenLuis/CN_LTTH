import { check } from 'express-validator'
import { transValidation } from './../constants/languageEn'

let registerProvider = [
  check('email', transValidation.email_incorrect)
    .isEmail()
    .trim(),
  check('name', transValidation.username_incorrect )
    .matches(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/)
    .isLength({ max: 128, min: 1 })
    .trim(),
  check('address', transValidation.address_incorrect)
    .isLength({ max: 200 }),
  check('phone', transValidation.update_phone)
    .matches(/^(0)[0-9]{9,10}$/),
  check('cardNumber', transValidation.card_number)
    .matches(/([0-9]{4})([ ]{1})([0-9]{4})([ ]{1})([0-9]{4})([ ]{1})([0-9]{4})$/),
  check('accountNumber', transValidation.account_number)
    .matches(/^[0-9A-Z]{8,16}$/),
  check('cardDate', transValidation.card_date)
    .matches(/^([0-9]{2})([/]{1})([0-9]{2})$/)
    .custom(value => {
      let month = parseInt(value.split('/')[0])
      return month > 0 && month < 13
    }),
  check('cardHolder', transValidation.card_holder)
    .matches(/^[\sA-Z ]+$/)
    .isLength({ max: 128, min: 1 }),
  check('bank', transValidation.bank)
    .custom(value => {
      return value && value !== ''
    }),
  check('isAllowBusiness', transValidation.not_allow_business)
    .custom(value => {
      return value === true || value === 'true'
    }),
  check('businessCode', transValidation.business_code)
    .matches(/^[0-9]{10}$/)
]

module.exports = {
  registerProvider
}
