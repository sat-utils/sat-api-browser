import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { getIn } from 'formik';
import { InlineDateTimePicker } from 'material-ui-pickers';

const styles = theme => ({
  textField: {
    display: 'block',
    marginTop: theme.spacing.unit * 2
  },
});

const DatePicker = (props) => {
  const {
    name,
    setFieldValue,
    errors,
    values,
    label,
    classes
  } = props;

  // Limiting props.
  const limit = {};
  if (name === 'startdatetime') {
    limit.maxDate = getIn(values, 'enddatetime');
  }
  if (name === 'enddatetime') {
    limit.minDate = getIn(values, 'startdatetime');
  }

  const fieldError = getIn(errors, name);
  const value = getIn(values, name);
  return (
    <InlineDateTimePicker
      label={label}
      error={Boolean(errors[name])}
      helperText={fieldError && String(fieldError)}
      value={value}
      name={name}
      format="yyyy/MM/dd hh:mm a"
      className={classes.textField}
      onChange={(v => setFieldValue(name, v))}
      {...limit}
    />
  );
};

DatePicker.propTypes = {
  name: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired
};

export default withStyles(styles)(DatePicker);
