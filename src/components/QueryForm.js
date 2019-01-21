import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withFormik } from 'formik';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FormLabel from '@material-ui/core/FormLabel';
import FormikDatePicker from './FormikDatePicker';
import { fetchFilteredItems } from '../actions/queryActions';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  grid: {
    marginTop: theme.spacing.unit * 3
  },
  submit: {
    textAlign: 'center'
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  }
});

export const QueryForm = (props) => {
  const {
    classes,
    handleSubmit,
    setValues,
    values,
    isValid,
    ...formikFieldProps
  } = props;
  return (
    <Grid
      container
      justify="center"
      className={classes.grid}
    >
      <Grid item xs={8}>
        <form onSubmit={handleSubmit}>
          <FormLabel component="legend">
            Date Range
          </FormLabel>
          <FormikDatePicker
            name="startdatetime"
            label="Start Date"
            values={values}
            {...formikFieldProps}
          />
          <FormikDatePicker
            name="enddatetime"
            label="End Date"
            values={values}
            {...formikFieldProps}
          />
          <br />
          <br />
          <div className={classes.submit}>
            <Button
              className={classes.button}
              type="submit"
              variant="contained"
              color="primary"
              disabled={!isValid}
            >
              Submit Query
            </Button>
          </div>
        </form>
      </Grid>
    </Grid>
  );
};

const EnhancedForm = withFormik({
  mapPropsToValues: () => ({
    startdatetime: new Date().toISOString().substring(0, 16),
    enddatetime: new Date().toISOString().substring(0, 16)
  }),

  handleSubmit: (values, { props, setSubmitting }) => {
    const { fetchFilteredItemsAction } = props;
    const {
      startdatetime,
      enddatetime
    } = values;
    const filter = {
      time: `${startdatetime}/${enddatetime}`
    };
    fetchFilteredItemsAction(filter);
    setSubmitting(false);
  }
})(QueryForm);

QueryForm.propTypes = {
  fetchFilteredItemsAction: PropTypes.func.isRequired
};

const mapDispatchToProps = { fetchFilteredItemsAction: fetchFilteredItems };
export default withStyles(styles)(connect(null, mapDispatchToProps)(EnhancedForm));
