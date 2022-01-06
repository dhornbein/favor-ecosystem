import { extend } from "vee-validate";
import { required, min, min_value } from "vee-validate/dist/rules";
import { validate as uuidValidate } from 'uuid'

extend("required", {
  ...required,
  message: "This field is required"
});

extend("min_value", {
  ...min_value,
  message: "The {_field_} must be at greater than {min}"
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
