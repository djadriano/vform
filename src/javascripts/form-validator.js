// ---------------------------------------------------------------
// Set private methods as a Symbol
// ---------------------------------------------------------------

const registerFormEventListeners = Symbol('registerFormEventListeners');
const setFieldsEventListener = Symbol('setFieldsEventListener');
const checkFieldValidity = Symbol('checkFieldValidity');
const compareDataValue = Symbol('compareDataValue');
const compareElemFields = Symbol('compareElemFields');
const checkFormStatus = Symbol('checkFormStatus');
const getRadioFields = Symbol('getRadioFields');
const getCheckboxFields = Symbol('getCheckboxFields');
const mergeOptions = Symbol('mergeOptions');
const debounce = Symbol('debounce');

// ---------------------------------------------------------------
// Define defaults config
// ---------------------------------------------------------------

const defaults = {
  classes: {
    valid: 'form-field--valid',
    invalid: 'form-field--invalid',
    formValid: 'form--valid'
  },
  data: null,
  events: {
    onInitializedSuccess: null,
    onInitializedError: null,
    onSubmit: null,
    onReset: null,
    onValid: null
  }
};

class FormValidator {
  constructor(el, settings = {}) {
    this.form = document.querySelector(el);
    this.el = el;
    this.defaults = this[mergeOptions](settings);

    this.initialize();
  }

  initialize() {
    this.form ? this.onInitializedSuccess() : this.onInitializedError();
  }

  // ---------------------------------------------------------------
  // Events Methods
  // ---------------------------------------------------------------

  onInitializedSuccess() {
    const { onInitializedSuccess } = this.defaults.events;

    if (onInitializedSuccess) {
      onInitializedSuccess();
      this[checkFormStatus]();
    }

    this[registerFormEventListeners]();
    this[setFieldsEventListener]();
  }

  // -------------------------------------------------------------------------

  onInitializedError() {
    const { onInitializedError } = this.defaults.events;

    console.error(`${this.el} DOM element not found`);
    if (onInitializedError) onInitializedError();
  }

  // -------------------------------------------------------------------------

  onSubmit(evt) {
    evt.preventDefault();
    const { onSubmit } = this.defaults.events;

    if (onSubmit) onSubmit();
  }

  // -------------------------------------------------------------------------

  onReset(evt) {
    const { onReset } = this.defaults.events;

    if (onReset) onReset();
  }

  // -------------------------------------------------------------------------

  onValid() {
    const { onValid } = this.defaults.events;

    if (onValid) {
      onValid(
        this.form.checkValidity(),
        this.form.checkValidity() ? this.getFieldsValues() : null
      );
    }
  }

  // ---------------------------------------------------------------
  // Core Methods
  // ---------------------------------------------------------------

  getFields() {
    return [ ...this.form.elements ].filter(
      item =>
        item.type != 'file' &&
        item.type != 'reset' &&
        item.type != 'submit' &&
        item.type != 'button'
    );
  }

  // -------------------------------------------------------------------------

  update() {
    this[setFieldsEventListener]('removeEventListener');
    this[setFieldsEventListener]();
    this[checkFormStatus]();
  }

  // -------------------------------------------------------------------------

  setFieldValid(elField, shouldSetCustomValidity = false) {
    let { classes } = this.defaults;

    elField.classList.add(classes.valid);
    elField.classList.remove(classes.invalid);

    if (shouldSetCustomValidity) elField.setCustomValidity('');
  }

  // -------------------------------------------------------------------------

  setFieldInvalid(elField, shouldSetCustomValidity = false) {
    let { classes } = this.defaults;

    elField.classList.add(classes.invalid);
    elField.classList.remove(classes.valid);

    if (shouldSetCustomValidity) elField.setCustomValidity('error');
  }

  // -------------------------------------------------------------------------

  getFieldsValues() {
    let formFields = this.getFields();

    return new Promise((resolve, reject) => {
      if (formFields && this.form.checkValidity()) {
        let fieldsValue = {};

        formFields
          .filter(item => item.type != 'radio' && item.type != 'checkbox')
          .map(item => {
            fieldsValue[item.name] = item.value;
          });

        fieldsValue = { ...fieldsValue, ...this[getRadioFields]() };
        fieldsValue = { ...fieldsValue, ...this[getCheckboxFields]() };

        resolve(fieldsValue);
      } else {
        reject();
      }
    });
  }

  // ---------------------------------------------------------------
  // Core Private Methods
  // ---------------------------------------------------------------

  [registerFormEventListeners]() {
    this.form.addEventListener('submit', this.onSubmit.bind(this));
    this.form.addEventListener('reset', this.onReset.bind(this));
  }

  // -------------------------------------------------------------------------

  [setFieldsEventListener](listenerType = 'addEventListener') {
    let formFields = this.getFields();

    if (formFields.length) {
      formFields.map(item => {
        if (item.type === 'checkbox' || item.type === 'radio') {
          item[listenerType](
            'change',
            this[checkFieldValidity].bind(this),
            false
          );
        } else {
          // listener when change the field
          if (
            item.getAttribute('data-valid-on-change') &&
            item.getAttribute('data-valid-on-change') === '1'
          ) {
            item[listenerType](
              'input',
              this[checkFieldValidity].bind(this),
              false
            );
          }

          // listener when blur the field
          if (
            item.getAttribute('data-valid-on-blur') &&
            item.getAttribute('data-valid-on-blur') === '1'
          ) {
            item[listenerType](
              'blur',
              this[checkFieldValidity].bind(this),
              false
            );
          }

          // listener when user finishes typing
          if (
            item.getAttribute('data-valid-on-typed') &&
            item.getAttribute('data-valid-on-typed') === '1'
          ) {
            item[listenerType](
              'input',
              this[debounce](evt => this[checkFieldValidity](evt), 1200),
              false
            );
          }
        }
      });
    }
  }

  // -------------------------------------------------------------------------

  [checkFieldValidity](event) {
    event.preventDefault();
    const elField = event.target;
    const attributeToCompareElemValue = elField.getAttribute(
      'data-compare-elem-value'
    );
    const attributeToCompareData = elField.getAttribute('data-compare-data');

    if (attributeToCompareElemValue) {
      this[compareElemFields](elField, attributeToCompareElemValue);
    } else if (attributeToCompareData) {
      this[compareDataValue](elField, attributeToCompareData);
    } else {
      elField.validity.valid
        ? this.setFieldValid(elField)
        : this.setFieldInvalid(elField);
    }

    this[checkFormStatus]();
  }

  // -------------------------------------------------------------------------

  [compareDataValue](elField, dataToCompare) {
    elField.value === this.props.data[dataToCompare]
      ? this.setFieldValid(elField, true)
      : this.setFieldInvalid(elField, true);
  }

  // -------------------------------------------------------------------------

  [compareElemFields](currentField, fieldToCompare) {
    const elToCheckValue = document.querySelector(fieldToCompare);

    console.log(currentField.validity);

    if (elToCheckValue && currentField.validity.valueMissing) {
      this.setFieldInvalid(currentField);
    } else {
      if (elToCheckValue && currentField.value === elToCheckValue.value) {
        this.setFieldValid(currentField, true);
        this.setFieldValid(elToCheckValue, true);
      } else {
        this.setFieldInvalid(currentField, true);
        this.setFieldInvalid(elToCheckValue, true);
      }
    }
  }

  // -------------------------------------------------------------------------

  [checkFormStatus]() {
    let { classes } = this.defaults;

    if (this.form.checkValidity()) {
      this.form.classList.add(classes.formValid);
    } else {
      this.form.classList.remove(classes.formValid);
    }

    this.onValid();
  }

  // -------------------------------------------------------------------------

  [getRadioFields]() {
    let formFields = this.getFields();
    let radioFields = {};

    formFields
      .filter(item => item.type == 'radio' && item.checked)
      .map(item => {
        if (item.name) radioFields[item.name] = item.value;
      });

    return radioFields;
  }

  // -------------------------------------------------------------------------

  [getCheckboxFields]() {
    let formFields = this.getFields();

    let checkboxFields = formFields.filter(
      item => item.type == 'checkbox' && item.checked
    );

    const groupBy = (arr, key) => {
      return (arr || []).reduce(
        (acc, item = {}) => ({
          ...acc,
          [item[key]]: [ ...(acc[item[key]] || []), item.value ]
        }),
        {}
      );
    };

    return groupBy(checkboxFields, 'name');
  }

  // -------------------------------------------------------------------------

  [mergeOptions](settings) {
    let options = Object.assign({}, defaults, settings);

    if (settings.hasOwnProperty('events')) {
      options.events = Object.assign({}, defaults.events, settings.events);
    }

    return options;
  }

  // -------------------------------------------------------------------------

  [debounce](func, wait, immediate) {
    let timeout;
    return (...funcArgs) => {
      let args = funcArgs;
      let later = function() {
        timeout = null;
        if (!immediate) func.apply(this, args);
      };
      let callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(this, args);
    };
  }
}

export default FormValidator;
