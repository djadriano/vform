import 'babel-polyfill';
import 'stylesheets/index';

import VForm from 'source/vform';

document.addEventListener('DOMContentLoaded', event => {
  new VForm('.form', {
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
