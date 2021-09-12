const dynamicInput = {
  className: 'dynamic-input',

  /**
   * @desc input 엘리먼트 생성
   */
  create(labelText, inputAttributeObj = {}) {
    const { className } = this;
    const inputWrapper = document.createElement('section');
    inputWrapper.classList.add(`${className}-wrap`);
    const inputAttributeStrings = Object.entries(inputAttributeObj)
      .map(([key, value]) => `${key}="${value}"`)
      .reduce((acc, cur) => `${acc} ${cur}`, '')
      .trim();
    const randomId = Math.floor(Math.random() * 10000);

    inputWrapper.innerHTML = `
<input ${inputAttributeStrings} id="${randomId}" class="${className}"/>
<label for="${randomId}">${labelText}</label>
    `.trim();

    return inputWrapper;
  },

  /**
   * @desc 기본 스타일을 <head>에 추가
   */
  setDefaultStyle() {
    const { className } = this;
    const styleTag = document.createElement('style');
    styleTag.setAttribute('type', 'text/css');

    const css = /* css */ `
.${className}-wrap {
  position: relative;
  margin-bottom: 0.375rem;
}
.${className} {
  width: 100%;
  height: 2.25rem;
  border: 1px solid #dbdbdb;
  border-radius: 5px;
  padding: 0.33rem 0.66rem;
}
.${className}::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
.${className}-wrap label {
  position: absolute;
  transform: translate(0, -50%);
  top: 50%;
  left: 3.5%;
  padding: 0 0.33rem;
  background-color: #fff;
  font-size: 0.8rem;
  transition: all 0.45s;
}
.${className}-label-position {
  top: 5% !important;
  font-size: 0.5rem !important;
}
    `.trim();

    const styleAttribute = document.createTextNode(css);
    styleTag.appendChild(styleAttribute);
    document.head.appendChild(styleTag);
  },

  /**
   * @desc input 엘리먼트에 밸류 여부에 따라 label 포지션을 변경하는 이벤트 리스너 추가
   */
  inputDetector() {
    const { className } = this;
    const inputs = document.querySelectorAll(`.${className}`);

    const handlePosition = (e) => {
      const label = e.target.parentNode.querySelector('label');
      if (e.target.value.length >= 1) {
        label.classList.add(`${className}-label-position`);
      } else {
        label.classList.remove(`${className}-label-position`);
      }
    };

    // eslint-disable-next-line no-restricted-syntax
    for (const input of inputs) {
      input.addEventListener('input', handlePosition);
    }
  },
};

export default dynamicInput;
