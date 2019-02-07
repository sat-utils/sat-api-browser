import React from 'react';
import PropTypes from 'prop-types';
import { getIn } from 'formik';
import TextField from '@material-ui/core/TextField';

const FormikTextField = (props) => {
  const {
    name,
    handleChange,
    handleBlur,
    touched,
    errors,
    values,
    label,
    helperText
  } = props;

  const fieldError = getIn(errors, name);
  const showError = getIn(touched, name) && !!fieldError;
  const value = getIn(values, name);
  return (
    <TextField
      name={name}
      label={label}
      value={value}
      margin="normal"
      onChange={handleChange}
      onBlur={handleBlur}
      helperText={
        (fieldError
        && showError
        && String(fieldError))
        || helperText
      }
      style={{ verticalAlign: 'unset', marginLeft: '10px' }}
      error={
        Boolean(errors[name] && touched[name])
      }
    />
  );
};

FormikTextField.defaultProps = {
  helperText: ''
};

FormikTextField.propTypes = {
  name: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  touched: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  helperText: PropTypes.string
};

export default FormikTextField;
