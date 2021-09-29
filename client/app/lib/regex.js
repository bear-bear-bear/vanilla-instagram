const pattern = {
  username: '[\\w.]{6,20}',
  realname: '([가-힣]{2,20}|[a-zA-Z]{2,20})',
  phoneNumber: '^\\d{10}',
  password: '[!@#$%^&*~+-\\w]{6,500}',
};
export default pattern;
