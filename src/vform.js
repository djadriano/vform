// ---------------------------------------------------------------
// Set private methods as a Symbol
// ---------------------------------------------------------------

const registerFormEventListeners = Symbol('registerFormEventListeners');
const setFieldsEventListener = Symbol('setFieldsEventListener');
const getErrorElement = Symbol('getErrorElement');
const checkFormStatus = Symbol('checkFormStatus');
const getRadioFields = Symbol('getRadioFields');
const getCheckboxFields = Symbol('getCheckboxFields');
const checkRadioCheckboxFieldsValidity = Symbol('checkRadioCheckboxFieldsValidity');
const checkOnTypeFieldIsEmpty = Symbol('checkOnTypeFieldIsEmpty');
const checkFieldIsEmpty = Symbol('checkFieldIsEmpty');
const checkFieldIsNotEmpty = Symbol('checkFieldIsNotEmpty');
const focusOnFirstFieldError = Symbol('focusOnFirstFieldError');
const getContainerElement = Symbol('getContainerElement');
const mergeOptions = Symbol('mergeOptions');
const debounce = Symbol('debounce');

// ---------------------------------------------------------------
// Define defaults config
// ---------------------------------------------------------------

const defaults = {
  classes: {
    valid: 'field--valid',
    invalid: 'field--invalid',
    formValid: 'form--valid',
    errorElement: 'field-error'
  },
  events: {
    onInitializedSuccess: null,
    onInitializedError: null,
    onSubmit: null,
    onReset: null,
    onValid: null,
    onBlurFieldChecked: null,
    onChangeFieldChecked: null,
    execBeforeSubmit: null
  }
};

class VForm {
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
      onInitializedSuccess(this.form);
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

  async onSubmit(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    const { onSubmit, execBeforeSubmit } = this.defaults.events;

    let formFields = this.getFields();

    if (formFields.length) {
      if (execBeforeSubmit) await execBeforeSubmit();

      if (!this.form.checkValidity()) {
        formFields.filter(field => field.hasAttribute('required')).map(item => {
          this.checkFieldsValidity({ el: item });
        });

        this[focusOnFirstFieldError]();
      } else {
        if (onSubmit) onSubmit(this.getFieldsValues());
      }
    }
  }

  // -------------------------------------------------------------------------

  onReset() {
    const { onReset } = this.defaults.events;

    if (onReset) onReset();
  }

  // -------------------------------------------------------------------------

  onValid() {
    const { onValid } = this.defaults.events;

    if (onValid) {
      onValid(this.form.checkValidity(), this.form.checkValidity() ? this.getFieldsValues() : null);
    }
  }

  // ---------------------------------------------------------------
  // Core Methods
  // ---------------------------------------------------------------

  getFields() {
    return [...this.form.elements].filter(
      item =>
        item.type != 'file' &&
        item.type != 'reset' &&
        item.type != 'submit' &&
        item.type != 'button' &&
        item.getAttribute('name')
    );
  }

  // -------------------------------------------------------------------------

  update() {
    this[setFieldsEventListener]('removeEventListener');
    this[setFieldsEventListener]();
  }

  // -------------------------------------------------------------------------

  getFieldsValues() {
    let formFields = this.getFields();

    return new Promise((resolve, reject) => {
      if (formFields && this.form.checkValidity()) {
        let fieldsValue = {};

        formFields
          .filter(item => item.type != 'radio' && item.type != 'checkbox' && item.getAttribute('name'))
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

  // -------------------------------------------------------------------------

  checkFieldsValidity = prop => {
    const field = prop.hasOwnProperty('el') ? prop.el : prop.target;

    prop.type == 'blur' ? this[checkFieldIsNotEmpty](field, true) : this[checkFieldIsEmpty](field);
  };

  // -------------------------------------------------------------------------

  setValidField(field) {
    const { customError } = field.validity;
    let { classes } = this.defaults;
    const containerEl = this[getContainerElement](field);

    if (customError) field.setCustomValidity('');

    containerEl.classList.remove(classes.invalid);
  }

  // -------------------------------------------------------------------------

  setInValidField(field) {
    const { customError } = field.validity;
    let { classes } = this.defaults;
    const containerEl = this[getContainerElement](field);
    const getErrorMessage = field.getAttribute('data-error-message');

    if (!customError) field.setCustomValidity('error');

    containerEl.classList.add(classes.invalid);

    this.setErrorMessage(field, getErrorMessage);
  }

  // -------------------------------------------------------------------------

  setErrorMessage(field = null, message = null) {
    let { classes } = this.defaults;
    const containerEl = this[getContainerElement](field);
    const errorEl = containerEl.querySelector(`.${classes.errorElement}`);

    if (field && message) {
      if (errorEl) errorEl.innerHTML = message;
    }
  }

  // ---------------------------------------------------------------
  // Core Private Methods
  // ---------------------------------------------------------------

  [registerFormEventListeners]() {
    this.form.addEventListener('submit', this.onSubmit.bind(this));
    this.form.addEventListener('reset', this.onReset.bind(this));
  }

  // -------------------------------------------------------------------------

  [getErrorElement](field) {
    return field.parentNode;
  }

  // -------------------------------------------------------------------------

  [getContainerElement](field) {
    const fieldName = field.getAttribute('name');
    const containerEl = this.form.querySelector(`[data-field-container="${fieldName}"]`);
    return containerEl;
  }

  // -------------------------------------------------------------------------

  [setFieldsEventListener](listenerType = 'addEventListener') {
    let formFields = this.getFields();

    if (formFields.length) {
      formFields.map(item => {
        if (item.type == 'radio' || item.type == 'checkbox') {
          item[listenerType]('change', this[checkRadioCheckboxFieldsValidity], false);
        } else if (item.type == 'select-one') {
          item[listenerType]('change', this[checkOnTypeFieldIsEmpty], false);
        } else {
          item[listenerType]('input', this[checkOnTypeFieldIsEmpty], false);
          item[listenerType]('blur', this.checkFieldsValidity, false);
        }
      });
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

    formFields.filter(item => item.type == 'radio' && item.checked && item.getAttribute('name')).map(item => {
      if (item.name) radioFields[item.name] = item.value;
    });

    return radioFields;
  }

  // -------------------------------------------------------------------------

  [getCheckboxFields]() {
    let formFields = this.getFields();

    let checkboxFields = formFields.filter(
      item => item.type == 'checkbox' && item.checked && item.getAttribute('name')
    );

    const groupBy = (arr, key) => {
      return (arr || []).reduce(
        (acc, item = {}) => ({
          ...acc,
          [item[key]]: [...(acc[item[key]] || []), item.value]
        }),
        {}
      );
    };

    return groupBy(checkboxFields, 'name');
  }

  // -------------------------------------------------------------------------

  [checkOnTypeFieldIsEmpty] = evt => {
    const field = evt.target;
    const { valid, valueMissing, typeMismatch, patternMismatch, tooLong, tooShort, customError } = field.validity;

    const { classes } = this.defaults;
    const { onChangeFieldChecked } = this.defaults.events;
    const containerEl = this[getContainerElement](field);

    if (valid && !valueMissing) {
      containerEl.classList.remove(classes.invalid);
    }

    if (valid && !valueMissing) {
      if (!typeMismatch && !patternMismatch && !tooLong && !tooShort) {
        if (onChangeFieldChecked) onChangeFieldChecked(field);
      }
    } else if (!valid && customError) {
      if (onChangeFieldChecked) onChangeFieldChecked(field);
    }
  };

  // -------------------------------------------------------------------------

  [checkFieldIsEmpty](field) {
    const { valid, valueMissing } = field.validity;
    let { classes } = this.defaults;
    const containerEl = this[getContainerElement](field);
    const getEmptyMessage = field.getAttribute('data-empty-message');
    const invalidClass = classes.invalid;

    if (containerEl) {
      const errorEl = containerEl.querySelector(`.${classes.errorElement}`);

      const setErrorToField = () => {
        containerEl.classList.add(invalidClass);
        if (errorEl) errorEl.innerHTML = getEmptyMessage;
      };

      !valid && valueMissing ? setErrorToField() : this[checkFieldIsNotEmpty](field, false);
    }
  }

  // -------------------------------------------------------------------------

  [checkFieldIsNotEmpty] = (field, isBlur = true) => {
    const { onBlurFieldChecked } = this.defaults.events;
    const { valid, valueMissing, typeMismatch, patternMismatch, tooLong, tooShort, customError } = field.validity;

    const { classes } = this.defaults;
    const containerEl = this[getContainerElement](field);
    const getErrorMessage = field.getAttribute('data-error-message');
    const getLengthMessage = field.getAttribute('data-length-message');
    const fieldMinLength = field.getAttribute('minlength');
    const invalidClass = classes.invalid;

    if (containerEl) {
      const errorEl = containerEl.querySelector(`.${classes.errorElement}`);

      if (!valid && !valueMissing) {
        if (typeMismatch || patternMismatch || tooLong || tooShort) {
          containerEl.classList.add(invalidClass);

          if (errorEl) {
            errorEl.innerHTML =
              fieldMinLength && field.value.length < fieldMinLength
                ? getLengthMessage || getErrorMessage
                : getErrorMessage;
          }
        } else {
          if (!valid && customError) {
            if (isBlur && onBlurFieldChecked) {
              onBlurFieldChecked(field);
              this.onValid();
            }
          }
        }
      } else if (valid && !valueMissing) {
        containerEl.classList.remove(invalidClass);
        errorEl.innerHTML = '';

        if (isBlur && onBlurFieldChecked) {
          onBlurFieldChecked(field);
          this.onValid();
        }
      }
    }
  };

  // -------------------------------------------------------------------------

  [checkRadioCheckboxFieldsValidity] = evt => {
    let { classes } = this.defaults;
    let el = evt.target;
    let allCheckFields = [...document.getElementsByName(el.getAttribute('name'))];

    if (el.validity.valid) {
      allCheckFields.map(item => {
        const containerEl = this[getContainerElement](item);

        if (containerEl) {
          const errorEl = containerEl.querySelector(`.${classes.errorElement}`);

          containerEl.classList.remove(classes.invalid);
          errorEl.innerHTML = '';
        }
      });

      this.onValid();
    }
  };

  // -------------------------------------------------------------------------

  [focusOnFirstFieldError]() {
    let firstFieldInvalid = document.querySelectorAll(':invalid');
    firstFieldInvalid = [...firstFieldInvalid].filter(field => field.getAttribute('name'));

    if (firstFieldInvalid && firstFieldInvalid.length > 1) firstFieldInvalid[0].focus();
  }

  // -------------------------------------------------------------------------

  [mergeOptions](settings) {
    let options = Object.assign({}, defaults, settings);

    if (settings.hasOwnProperty('events')) {
      options.events = Object.assign({}, defaults.events, settings.events);
    }

    if (settings.hasOwnProperty('classes')) {
      options.classes = Object.assign({}, defaults.classes, settings.classes);
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

export default VForm;
