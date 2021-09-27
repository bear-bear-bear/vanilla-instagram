import dynamicInput from '@/lib/dynamicInput';
import pattern from '@/lib/regex';

const authForm = document.querySelector('.auth-form');

const idInput = dynamicInput.create('전화번호 혹은 사용자 이름', {
  type: 'text',
  required: 'required',
  pattern: pattern.username,
});
const passwordInput = dynamicInput.create('비밀번호', {
  type: 'text',
  required: 'required',
  pattern: pattern.password,
});
authForm.prepend(idInput, passwordInput);
dynamicInput.setDefaultStyle();
dynamicInput.inputDetector();
