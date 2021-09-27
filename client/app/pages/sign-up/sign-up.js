import dynamicInput from '@/lib/dynamicInput';
import pattern from '@/lib/regex';

const authForm = document.querySelector('.auth-form');
const phoneNumberInput = dynamicInput.create('전화번호', {
  type: 'number',
  required: 'required',
  pattern: pattern.phoneNumber,
});
const realNameInput = dynamicInput.create('성명', {
  type: 'text',
  required: 'required',
  pattern: pattern.realname,
});
const userNameInput = dynamicInput.create('사용자 이름', {
  type: 'text',
  required: 'required',
  pattern: pattern.username,
});
const passwordInput = dynamicInput.create('비밀번호', {
  type: 'text',
  required: 'required',
  pattern: pattern.password,
});

authForm.prepend(phoneNumberInput, realNameInput, userNameInput, passwordInput);

dynamicInput.setDefaultStyle();
dynamicInput.inputDetector();
