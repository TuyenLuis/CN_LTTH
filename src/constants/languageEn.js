export const transValidation = {
  email_incorrect: 'Email phải có dạng example@abc.com',
  password_incorrect: 'Mật khẩu chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, chữ số và ký tự đặc biệt',
  password_confirmation_incorrect: 'Nhập lại mật khẩu không chính xác',
  username_incorrect: 'Tên không được chưa ký tự đặc biệt. Giới hạn 128 ký tự',
  address_incorrect: 'Địa chỉ giới hạn là 200 kí tự',
  update_phone: 'Số điện thoại Việt Nam bắt đầu bằng số 0, giới hạn trong khoảng 10 - 11 ký tự',
  sku_product: 'SKU chỉ bao gồm các kí tự chữ số',
  product_incorrect: 'Không thể chỉnh sửa sản phẩm này',
  catalog_incorrect: 'Sản phẩm này phải thuộc 1 danh mục'
}

export const transError = {
  email_in_used: 'Email này đã được sử dụng',
  account_non_active: 'Tài khoản của bạn đã bị khóa, hãy đăng nhập bằng tài khoản khác!',
  login_failed: 'Sai tài khoản hoặc mật khẩu.',
  authen_process: 'Xảy ra lỗi trong quá trình xác thực',
  require_login: 'Bạn phải đăng nhập để sử dụng chức năng này.',
  require_logout: 'Bạn phải đăng xuất trước.',
  register_failed: 'Tạo tài khoản không thành công. Xin kiểm tra lại',
  permission_denied: 'Bạn không có quyền thực hiện chức năng này',
  avatar_type: 'Kiểu file không hợp lệ, chỉ chấp nhận JPG hoặc PNG.',
  image_size: 'Kích thước ảnh tối đa là 2MB.',
  limit_file_upload: 'Số lượng file upload tối đa là 15.',
  add_product: 'Thêm sản phẩm mới thất bại.',
  product_id_empty: 'Mã sản phẩm là bắt buộc.',
  product_id_not_existed: 'Không tìm thấy sản phẩm có mã #productId. Hãy kiểm tra lại.'
}

export const transSuccess = {
  login_success: 'Đăng nhập thành công',
  logout_success: 'Đăng xuất thành công',
  register_success: 'Tài khoản đã được tạo thành công',
  add_product_success: 'Sản phẩm đã được thêm thành công',
  remove_product_success: 'Xóa sản phẩm thành công',
  update_product_success: 'Cập nhật sản phẩm thành công'
}
