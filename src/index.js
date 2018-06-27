import React from 'react';
import ReactDOM from 'react-dom';

import 'babel-polyfill';

import './stylesheets/index';

import FormValidator from './javascripts/form-validator';

let foo;

document.addEventListener('DOMContentLoaded', event => {
  foo = new FormValidator('.form', {
    classes: {
      container: 'ag-field',
      errorElement: 'ag-field-error'
    },
    events: {
      onInitializedSuccess: onInitializedSuccessForm,
      onInitializedError: onInitializedError,
      onValid: onValid,
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

const onValid = async(formStatus, formFields) => {
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
    <div className="ag-field">
      <input
        type="email"
        name="name"
        data-valid-on-blur="1"
        minLength="4"
        required
        className="foo"
        data-empty-message="Empty message"
        data-error-message="Error message"
      />
      <span className="ag-field-error" />
    </div>
    <p>
      <input type="radio" name="foo" value="1" defaultChecked />Eu{' '}
      <input type="radio" name="foo" value="2" /> Tu{' '}
      <input type="radio" name="foo" value="3" /> Eles
      <input type="radio" name="bar" value="1" />Eu{' '}
      <input type="radio" name="bar" value="2" /> Tu{' '}
      <input type="radio" name="bar" value="3" /> Eles
    </p>
    <p>
      <input type="checkbox" name="foo-checkbox" value="1" defaultChecked />Eu{' '}
      <input type="checkbox" name="foo-checkbox" value="2" /> Tu{' '}
      <input type="checkbox" name="foo-checkbox" value="3" /> Eles
      <input type="checkbox" name="bar-checkbox" value="1" />Eu{' '}
      <input type="checkbox" name="bar-checkbox" value="2" /> Tu{' '}
      <input type="checkbox" name="bar-checkbox" value="3" /> Eles
    </p>
    <button>Submit</button> <button type="reset">Reset</button>
  </form>
);

ReactDOM.render(<App />, document.querySelector('#app'));

if (module.hot) {
  module.hot.accept();
}
