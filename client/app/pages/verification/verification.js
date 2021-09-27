import dynamicInput from '@/lib/dynamicInput';
import pattern from '@/lib/regex';

const authForm = document.querySelector('.auth-form');
const verificationInput = dynamicInput.create('', {
  type: 'text',
  required: 'required',
  pattern: pattern.verification,
});
authForm.insertBefore(verificationInput, authForm.lastChild);
dynamicInput.setDefaultStyle();
