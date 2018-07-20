# VForm

A dependency-free vanilla Javascript form validation using Constraint Validation API.
Just use HTML5 form fields based in validation attributes and that's it, the library resolve all!

See more about HTML validation attributes in MDN:
[MDN - Constraint validation](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation)

# Setup

Import the library in your code:

```javascript
import VForm from "vform";
```

# Usage

First initialize the library:

```javascript
document.addEventListener("DOMContentLoaded", event => {
  const Validation = new VForm(".form", {
    classes: {
      errorElement: "ag-field-error"
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

| Name         | Description                                                               |
| ------------ | ------------------------------------------------------------------------- |
| valid        | class that will be set in field after be validated                        |
| invalid      | class that will be set in field after check the status and return invalid |
| formValid    | class that will be set in form when is valid                              |
| errorElement | class of element that is render the error message                         |

# Events

| Name                 | Description                                                               |
| -------------------- | ------------------------------------------------------------------------- |
| onInitializedSuccess | class that will be set in field after be validated                        |
| onInitializedError   | class that will be set in field after check the status and return invalid |
| onSubmit             | class that will be set in form when is valid                              |
| onReset              | class of element that is render the error message                         |
| onValid              | class of element that is render the error message                         |
| onBlurFieldChecked   | class of element that is render the error message                         |
| onChangeFieldChecked | class of element that is render the error message                         |
| execBeforeSubmit     | class of element that is render the error message                         |

# Data Attributes

| Name                 | Description                                                               |
| -------------------- | ------------------------------------------------------------------------- |
| data-field-container | class that will be set in field after be validated                        |
| data-error-message   | class that will be set in field after check the status and return invalid |
| data-empty-message   | class that will be set in form when is valid                              |
| data-length-message  | class of element that is render the error message                         |

# Methods

| Name            | Description                                                               |
| --------------- | ------------------------------------------------------------------------- |
| update          | class that will be set in field after be validated                        |
| getFieldsValues | class that will be set in field after check the status and return invalid |
| setValidField   | class that will be set in form when is valid                              |
| setInValidField | class of element that is render the error message                         |
| setErrorMessage | class of element that is render the error message                         |
