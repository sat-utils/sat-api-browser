import React from 'react';
import { getIn } from 'formik';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const FormikSelector = (props) => {
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

  const error = getIn(errors, name);
  const showError = getIn(touched, name) && !!error;
  const value = getIn(values, name);
  return (
    <Select
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      helperText={
        (error
         && showError
         && String(error))
         || helperText
      }
      error={
        Boolean(errors[name] && touched[name])
      }
    >
      <MenuItem value="=">Equals</MenuItem>
      <MenuItem value=">">Greater Than</MenuItem>
      <MenuItem value="<">Less Than</MenuItem>
    </Select>
  );
};
export default FormikSelector;
