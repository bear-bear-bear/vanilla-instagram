import dynamicInput from '@/lib/DynamicInput';

dynamicInput.setDefaultStyle();
const authForm = document.querySelector('.auth-form');
const verificationInput = dynamicInput.create('', {
  type: 'text',
  required: 'required',
});
authForm.insertBefore(verificationInput, authForm.lastChild);
dynamicInput.setDefaultStyle();
