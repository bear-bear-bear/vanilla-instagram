const dynamicInput = {
  create: (labelText, inputAttributeObj = {}) => {
    const inputWrapper = document.createElement('section');
    inputWrapper.classList.add('input-wrap');
    const inputAttributeStrings = Object.entries(inputAttributeObj)
      .map(([key, value]) => `${key}="${value}"`)
      .reduce((acc, cur) => `${acc} ${cur}`, '')
      .trim();
    const randomId = Math.floor(Math.random() * 10000);
    inputWrapper.classList.add(`${randomId}-wrapper`);
    inputWrapper.innerHTML = `
    <input ${inputAttributeStrings} id="${randomId}" class="dynamic-input"/>
    <label for="${randomId}">${labelText}</label>
  `.trim();

    return inputWrapper;
  },
  setDefaultStyle: () => {
    const styleTag = document.createElement('style');
    styleTag.setAttribute('type', 'text/css');
    const css = /* css */ `
.input-wrap {
  position: relative;
  margin-bottom: 0.375rem;
}
.dynamic-input {
  width: 100%;
  height: 2.25rem;
  border: 1px solid #dbdbdb;
  border-radius: 5px;
  padding: 0.33rem 0.66rem;
}
.dynamic-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
.input-wrap label {
  position: absolute;
  transform: translate(0, -50%);
  top: 50%;
  left: 3.5%;
  padding: 0 0.33rem;
  background-color: #fff;
  font-size: 0.8rem;
  transition: all 0.45s;
}
.set-position {
  top: 5% !important;
  font-size: 0.5rem !important;
}
    `.trim();
    const styleAttribute = document.createTextNode(css);
    styleTag.appendChild(styleAttribute);
    document.head.appendChild(styleTag);
  },
  inputDetector: () => {
    const inputs = document.querySelectorAll('.dynamic-input');
    const handlePosition = (e) => {
      const targetInputLabel = e.target.parentNode.querySelector('label');
      if (e.target.value.length >= 1) {
        targetInputLabel.classList.add('set-position');
      } else {
        targetInputLabel.classList.remove('set-position');
      }
    };
    // eslint-disable-next-line no-restricted-syntax
    for (const input of inputs) {
      input.addEventListener('input', handlePosition);
    }
  },
};

export default dynamicInput;
