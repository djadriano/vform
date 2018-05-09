import React from 'react';
import ReactDOM from 'react-dom';

import 'babel-polyfill';

import './stylesheets/index';

import FormValidator from './javascripts/form-validator';

document.addEventListener('DOMContentLoaded', event => {
  new FormValidator('.form', {
    events: {
      onInitializedSuccess: onInitializedSuccessForm,
      onInitializedError: onInitializedError,
      onValid: onValid
    }
  });
});

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

const App = props => (
  <form className="form">
    <input
      type="text"
      name="name"
      data-valid-on-change="1"
      minLength="4"
      required
      placeholder="Name"
    />
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
    <button>Submit</button>
  </form>
);

ReactDOM.render(<App />, document.querySelector('#app'));

if (module.hot) {
  module.hot.accept();
}
