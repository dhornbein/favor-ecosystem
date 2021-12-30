import { extend } from "vee-validate";
import { required, min, min_value } from "vee-validate/dist/rules";

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
