import dynamicInput from '@/lib/DynamicInput';

const authForm = document.querySelector('.auth-form');
const phoneNumberInput = dynamicInput.create('전화번호', {
  type: 'number',
  required: 'required',
  pattern: '^(?=1)[d]{0,10}$',
});
const RealNameInput = dynamicInput.create('성명', {
  type: 'text',
  required: 'required',
  pattern: '^([가-힣]{2,20}|[a-zA-Z]{2,20})$',
});
const userNameInput = dynamicInput.create('사용자 이름', {
  type: 'text',
  required: 'required',
  pattern: '[w.]{6,20}',
});
const passwordInput = dynamicInput.create('비밀번호', {
  type: 'text',
  required: 'required',
  pattern: '[!@#$%^&*~+-w]{6,500}',
});

authForm.prepend(phoneNumberInput, RealNameInput, userNameInput, passwordInput);

dynamicInput.setDefaultStyle();
dynamicInput.inputDetector();
