import React from 'react';
import PropTypes from 'prop-types';
import { getIn } from 'formik';
import TextField from '@material-ui/core/TextField';

const WrappedTextField = (props) => {
  const {
    name,
    handleChange,
    handleBlur,
    errors,
    values,
    type,
    label,
    helperText
  } = props;

  const fieldError = errors[name];
  const value = getIn(values, name);
  return (
    <TextField
      name={name}
      label={label}
      type={type}
      value={value || ''}
      margin="normal"
      onChange={handleChange}
      onBlur={handleBlur}
      helperText={
        (fieldError
        && String(fieldError))
        || helperText
      }
      style={{ verticalAlign: 'unset', marginLeft: '10px' }}
      error={
        Boolean(errors[name])
      }
    />
  );
};

WrappedTextField.defaultProps = {
  helperText: ''
};

WrappedTextField.propTypes = {
  name: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  touched: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  helperText: PropTypes.string,
  label: PropTypes.string.isRequired
};

export default WrappedTextField;
