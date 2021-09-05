import DynamicInput from '@/lib/DynamicInput';

const authForm = document.querySelector('.auth-form');

const myInput = new DynamicInput('전화번호 혹은 username', {
  type: 'number',
  required: 'required',
  pattern: '+',
});

authForm.appendChild(myInput);
