const pattern = {
  username: '[w.]{6,20}',
  realname: '([가-힣]{2,20}|[a-zA-Z]{2,20})',
  phoneNumber: '^(?=1)[d]{0,10}',
  password: '[!@#$%^&*~+-w]{6,500}',
};
export default pattern;
