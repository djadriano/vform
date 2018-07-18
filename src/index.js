import React from 'react';
import ReactDOM from 'react-dom';

import 'babel-polyfill';
import './stylesheets/index';

import FormValidator from './javascripts/form-validator';

let foo;

document.addEventListener('DOMContentLoaded', event => {
  foo = new FormValidator('.form', {
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
  let foo = await fields;
  console.log('onInitializeSuccess', foo);
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
  const bar = await formFields;
  console.log('onValid', formStatus, bar);
};

const handleInput = evt => {
  console.log('handleInput');
  // evt.preventDefault();
  let el = evt.target;

  console.log('handleInput');

  if (el.validity.valid) {
    console.log('valid');
    if (el.value.length > 4) {
      foo.setFieldInvalid(el, true);
    } else {
      foo.setFieldValid(el, true);
    }
  } else {
    console.log('not valid');
    if (el.validity.customError) {
      console.log('has error');
      if (el.value.length > 4) {
        foo.setFieldInvalid(el, true);
      } else {
        foo.setFieldValid(el, true);
      }
    }
  }
};

const hello = evt => {
  console.log('hello');
};

const App = props => (
  <form className="form" noValidate>
    <label data-field-container="name">
      <input
        type="text"
        name="name"
        data-valid-on-blur="1"
        minLength="4"
        required
        className="foo"
        data-empty-message="Empty message"
        data-error-message="Error message"
        data-length-message="Length message"
      />
      <span className="ag-field-error" />
    </label>
    <div data-field-container="foo">
      <label className="ag-field">
        <input type="radio" name="foo" value="1" />Eu
      </label>
      <label className="ag-field">
        <input type="radio" name="foo" value="2" required data-empty-message="Empty message" /> Tu
      </label>
      <label className="ag-field">
        <input type="radio" name="foo" value="3" /> Eles
      </label>
      <span className="ag-field-error" />
    </div>
    <div data-field-container="bar">
      <label className="ag-field">
        <input type="checkbox" name="bar" value="1" required data-empty-message="Empty message" />Eu
      </label>
      <label className="ag-field">
        <input type="checkbox" name="bar" value="1" required data-empty-message="Empty message" />Eu
      </label>
      <span className="ag-field-error" />
    </div>
    <button>Submit</button> <button type="reset">Reset</button>
  </form>
);

ReactDOM.render(<App />, document.querySelector('#app'));

if (module.hot) {
  module.hot.accept();
}
