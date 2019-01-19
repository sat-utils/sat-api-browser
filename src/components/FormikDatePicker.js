import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { getIn } from 'formik';

const styles = theme => ({
  textField: {
    marginTop: theme.spacing.unit,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
});

const FormikDatePicker = (props) => {
  const {
    name,
    handleChange,
    errors,
    values,
    label,
    classes
  } = props;

  const fieldError = getIn(errors, name);
  const value = getIn(values, name);
  return (
    <TextField
      name={name}
      label={label}
      type="datetime-local"
      onChange={handleChange}
      defaultValue={value}
      className={classes.textField}
      helperText={
        (fieldError
        && String(fieldError))
      }
      error={
        Boolean(errors[name])
      }
      InputLabelProps={{
        shrink: true,
      }}
    />
  );
};

FormikDatePicker.propTypes = {
  name: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired
};

export default withStyles(styles)(FormikDatePicker);
