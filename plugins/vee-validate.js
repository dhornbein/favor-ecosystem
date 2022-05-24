/**
 * Extentions for vee-validate rules
 */
import { extend } from "vee-validate";
import { confirmed, required, min, min_value, max_value } from "vee-validate/dist/rules";
import { validate as uuidValidate } from 'uuid'

extend("confirmed", {
  ...confirmed,
  message: "This field must match the confirmation."
});
extend("required", {
  ...required,
  message: "This field is required"
});

extend("min_value", {
  ...min_value,
  message: "The {_field_} must be at greater than {min}"
});

extend("max_value", {
  ...max_value,
  message: "The {_field_} must be at less than {max}"
});

extend("min", {
  ...min,
  message: "This field must be at least {length} characters"
});

extend("uid", {
  validate: value => {
    return uuidValidate(value)
  },
  message: "{_field_} unique id is invalid"
});

extend("unique", {
  params: ['target', 'label'],
  validate: (value,{ target }) => {
    return value !== target
  },
  message: "{_field_} can NOT be the same as {label}"
});
