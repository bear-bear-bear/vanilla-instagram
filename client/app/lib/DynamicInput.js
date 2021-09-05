export default class DynamicInput {
  constructor(labelText, inputAttributeObj = {}) {
    const inputWrapper = document.createElement('section');
    const inputAttributeStrings = Object.entries(inputAttributeObj)
      .map(([key, value]) => `${key}="${value}"`)
      .reduce((acc, cur) => `${acc} ${cur}`, '')
      .trim();
    const randomId = Math.floor(Math.random * 10000);

    inputWrapper.innerHTML = `
      <input ${inputAttributeStrings} id="${randomId}"/>
      <label for="${randomId}">${labelText}</label>
    `.trim();

    return inputWrapper;
  }
}
