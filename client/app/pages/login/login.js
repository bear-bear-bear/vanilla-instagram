import dynamicInput from '@/lib/dynamicInput';

const authForm = document.querySelector('.auth-form');

const identificationInput = dynamicInput.create('전화번호 혹은 사용자 이름', {
  type: 'text',
  required: 'required',
  pattern: '[\\w.]{6,20}',
});
const passwordInput = dynamicInput.create('비밀번호', {
  type: 'text',
  required: 'required',
  pattern: '[!@#$%^&*~+\\-\\w]{6,500}',
});
authForm.prepend(identificationInput, passwordInput);
dynamicInput.setDefaultStyle();
dynamicInput.inputDetector();
