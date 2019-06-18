import React from 'react';
import PropTypes from 'prop-types';
import { getIn } from 'formik';
import TextField from '@material-ui/core/TextField';

const WrappedTextField = (props) => {
  const {
    name,
    setFieldValue,
    handleBlur,
    errors,
    values,
    type,
    label,
    helperText
  } = props;

  const fieldError = getIn(errors, name);
  const value = getIn(values, name);
  return (
    <TextField
      name={name}
      placeholder={label}
      fullWidth
      type={type}
      value={value ? value.eq : ''}
      margin="none"
      onChange={(event) => {
        setFieldValue(`${name}.eq`, event.target.value);
      }}
      onBlur={handleBlur}
      helperText={
        (fieldError
        && String(fieldError))
        || helperText
      }
      error={
        Boolean(fieldError)
      }
    />
  );
};

WrappedTextField.defaultProps = {
  helperText: ''
};

WrappedTextField.propTypes = {
  name: PropTypes.string.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  helperText: PropTypes.string,
  label: PropTypes.string.isRequired
};

export default WrappedTextField;
