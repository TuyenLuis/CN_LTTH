module.exports = {
  ROLES: {
    SUPPER_ADMIN: 'SupperAdmin',
    ADMIN: 'Admin',
    CUSTOMER: 'Customer'
  },
  IMAGE: {
    DIRECTORY: 'src/public/images',
    SIZE: 1048576 * 2, // 2 MB
    TYPE: ['image/png', 'image/jqg', 'image/jpeg'],
    LIMIT: 15,
    PUBLIC: 'src/public/'
  },
  ERROR_CODE: {
    LIMIT_UNEXPECTED_FILE: 'LIMIT_UNEXPECTED_FILE'
  },
  BACKEND: {
    HOST: 'http://localhost:6969/'
  },
  // BACKEND: {
  //   HOST: 'https://'
  // }
}
