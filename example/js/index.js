import 'stylesheets/index';

import VForm from 'source/vform';

let form1;
const disabledButton = document.querySelector('.disabled-btn');

document.addEventListener('DOMContentLoaded', event => {
  form1 = new VForm('.form', {
    classes: {
      errorElement: 'ag-field-error'
    },
    events: {
      onInitializedSuccess: onInitializedSuccessForm1,
      onInitializedError: onInitializedError,
      onValid: onValid,
      onBlurFieldChecked: onBlurFieldChecked,
      onSubmit: onSubmit,
      onFocus: onFocus
    }
  });

  new VForm('.form2', {
    classes: {
      errorElement: 'ag-field-error'
    },
    events: {
      onInitializedSuccess: onInitializedSuccessForm,
      onInitializedError: onInitializedError,
      onValid: onValid,
      onBlurFieldChecked: onBlurFieldChecked,
      onSubmit: onSubmit
    }
  });
});

const onSubmit = async fields => {
  let objFields = await fields;
  console.log('onSubmit', objFields);
};

const onFocus = field => {
  console.log('onFocus', field);
};

const onInitializedSuccessForm1 = () => {
  console.log('onInitializeSuccess1');
  disabledButton.addEventListener('click', disabledFields);
};

const onInitializedSuccessForm = () => {
  console.log('onInitializeSuccess');
};

const onInitializedError = () => {
  console.log('onInitializedError');
};

const onBlurFieldChecked = field => {
  console.log('onBlurFieldChecked', field);
};

const onValid = async (formStatus, formFields) => {
  const objFields = await formFields;
  console.log('onValid', formStatus, objFields);
};

const disabledFields = evt => {
  evt.preventDefault();

  Array.from(form1.form.elements)
    .filter(item => item.type != 'submit' && item.type != 'reset' && item.type != 'button')
    .map(item => {
      item.disabled = !item.disabled;
      form1.setValidField(item);
    });
};
