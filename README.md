![alt text](https://raw.githubusercontent.com/djadriano/vform/master/src/vform-logo.png "VForm - Vanilla JS Form Validation")

# VForm

A dependency-free vanilla Javascript form validation using Constraint Validation API.
Just use HTML5 form fields based in validation attributes and that's it, the library resolve all!

See more about HTML validation attributes in:
[MDN - Constraint validation](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation)

# Install

NPM:

```sh
npm i @djadrianof/vform
```

Yarn:

```sh
yarn add @djadrianof/vform
```

# Setup

Import the library in your code:

```javascript
import VForm from "@djadrianof/vform";
```

Or get the script directly from unpkg.com

```html
<script src="https://unpkg.com/@djadrianof/vform"></script>
```

# Usage

First initialize the library:

```javascript
document.addEventListener("DOMContentLoaded", event => {
  const Validation = new VForm(".form", {
    classes: {
      errorElement: "field-error"
    },
    events: {
      onInitializedSuccess: onInitializedSuccessForm,
      onInitializedError: onInitializedError,
      onValid: onValid,
      onBlurFieldChecked: onBlurFieldChecked,
      onChangeFieldChecked: onChangeFieldChecked,
      onSubmit: onSubmit
    }
  });
});
```

# Live Examples

* [Example 01 - Initialize library and basic usage](https://codepen.io/djadriano/pen/ejEZgP)
* [Example 02 - Checkbox and Radio Button](https://codepen.io/djadriano/full/ejVQBV)
* [Example 03 - Validate with Regex Pattern Attribute](https://codepen.io/djadriano/full/pZaQZa)

# Set your form element

Obs: Set the attribute noValidate in your form to prevent default browser validation.

```html
  <form class="form" noValidate>
    <label data-field-container="name">
      <input
        type="email"
        name="name"
        required
        class="foo"
        minlength="4"
        data-empty-message="Empty message"
        data-error-message="Error message"
        data-length-message="Length message"
      />
      <span class="field-error"></span>
    </label>
  </form>
```

# Options

Is possible set some options like css classes and events:

# Classes

Classes are helpful for indicate the state of field or form.

```javascript
const Validation = new VForm(".form", {
  classes: {
    valid: "field-valid",
    invalid: "field-invalid",
    formValid: "form-valid",
    errorElement: "error-element"
  }
});
```

| Name         | Description                                                               |
| ------------ | ------------------------------------------------------------------------- |
| valid        | class that will be set in field after be validated                        |
| invalid      | class that will be set in field after check the status and return invalid |
| formValid    | class that will be set in form when is valid                              |
| errorElement | class of element that is render the error message                         |

# Events

Events are helpful to get the status of form and fields.

```javascript
const Validation = new VForm(".form", {
  events: {
    onInitializedSuccess: onInitializedSuccessForm,
    onInitializedError: onInitializedError,
    onSubmit: onSubmit,
    onReset: onReset,
    onValid: onValid,
    onFocus: onFocus,
    onBlurFieldChecked: onBlurFieldChecked,
    onChangeFieldChecked: onChangeFieldChecked,
    execBeforeSubmit: execBeforeSubmit
  }
});
```

| Name                 | Description                                                                                                                     |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| onInitializedSuccess | Event is called if library is initialized with success. This method return the form DOM element                                 |
| onInitializedError   | Event is called if library is not initialized                                                                                   |
| onSubmit             | Event is called when the form is submited. If form is valid, the method return a promise with a object that contains the fields |
| onReset              | Event is called when the form is reseted                                                                                        |
| onValid              | Event is called when the form stay valid                                                                                        |
| onFocus              | Event is called when the field is invalid. The method return the field element                                                  |
| onBlurFieldChecked   | Event is called when the blur is executed and the field is valid. The method return the field element                           |
| onChangeFieldChecked | Event is called after the field element stay valid and in onChange listener. The method return the field element                |
| execBeforeSubmit     | Is executed before the submit of form. This method should return a promise                                                      |

# Data Attributes

Data attributes helps you to control and customize the validation.

```html
<label data-field-container="name">
    <input
        type="email"
        name="name"
        required
        class="foo"
        minlength="4"
        data-empty-message="Empty message"
        data-error-message="Error message"
        data-length-message="Length message"
    />
    <span class="field-error"></span>
</label>
```

With a reference error element

```html
<label data-field-container="age">
    <input
        type="text"
        name="age"
        required
        class="foo"
        minlength="4"
        data-empty-message="Empty message"
        data-error-message="Error message"
        data-length-message="Length message"
    />
    <span class="field-error" data-reference-error="age"></span>
</label>
```

| Name                 | Description                                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------- |
| data-field-container | This data indicate a container for field. The value should be the same value of name attribute of field element.    |
| data-error-message   | Message for indicate that field contains error                                                                      |
| data-empty-message   | Message for indicate that field is empty                                                                            |
| data-length-message  | Message for indicate that field needs contain a minimum size of characteres based on minlength attribute            |
| data-reference-error | This data indicate a different error element to show a error (use the same name of element that you need reference) |

# Methods

Are some helpful methods that you can access directly via library instance.

| Name            | Description                                                                                                                                                                |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| update          | Is helpful if needs insert a new field dynamically in form or needs remove some field of form. This method will register the listeners and set validations for new fields. |
| getFieldsValues | Return a promise that contain a object with fields values                                                                                                                  |
| setValidField   | Indicate that a field is valid                                                                                                                                             |
| setInValidField | Indicate that a field is not valid                                                                                                                                         |
| setErrorMessage | Set a error message dynamically for a field                                                                                                                                |

# Browser Support

* IE 11+
* Chrome 49+
* Safari 10+
* IOS Safari 10+
* Firefox 29+
