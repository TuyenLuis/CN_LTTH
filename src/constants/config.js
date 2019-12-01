module.exports = {
  ROLES: {
    SUPPER_ADMIN: 'SupperAdmin',
    ADMIN: 'Admin',
    CUSTOMER: 'Customer'
  },
  IMAGE: {
    DIRECTORY: 'src/public/images',
    SIZE: 1048576 * 2, // 2 MB
    TYPE: ['image/png', 'image/jpg', 'image/jpeg'],
    LIMIT: 15,
    PUBLIC: 'src/public/'
  },
  ERROR_CODE: {
    LIMIT_UNEXPECTED_FILE: 'LIMIT_UNEXPECTED_FILE'
  },
  VN_PAY_SANDBOX: {
    ORDER_TYPE: 'billpayment',
    BANK_CODE: 'NCB',
    DESCRIPTION: 'Thanh toan don hang thoi gian: $timeStamp',
    LANGUAGE: 'vn'
  },
  BACKEND: {
    HOST: 'http://localhost:6969/'
  },
  PROVIDER_STATUS: {
    PENDING: 0,
    APPROVED: 1,
    DELETED: 2
  },
  TRANSACTION_STATUS: {
    SUCCESS: 'Thành công',
    FAIL: 'Thất bại'
  },
  PAYMENT_TYPE: {
    AFTER_RECEIVE: 'Sau khi nhận hàng',
    ATM: 'Chuyển khoản'
  }
  // BACKEND: {
  //   HOST: 'https://'
  // }
}
