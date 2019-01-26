import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withFormik } from 'formik';
import { withStyles } from '@material-ui/core/styles';
import { Persist } from 'formik-persist';
import Grid from '@material-ui/core/Grid';
import FormLabel from '@material-ui/core/FormLabel';
import FormikDatePicker from './FormikDatePicker';
import { fetchFilteredItems } from '../actions/queryActions';
import { getQueryStatus } from '../reducers/querySelectors';
import { loading } from '../constants/applicationConstants';
import ProgressButton from './ProgressButton';

const limit = process.env.REACT_APP_RESULT_LIMIT;
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
    status,
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
            <ProgressButton
              type="submit"
              disabled={!isValid || status === loading}
              label="Submit Query"
              status={status}
              onClick={handleSubmit}
            />
          </div>
          <Persist
            name="query-form"
          />
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
      limit,
      time: `${startdatetime}/${enddatetime}`,
      query: {
        collection: {
          eq: 'landsat-8-l1'
        }
      }
    };
    fetchFilteredItemsAction(filter);
    setSubmitting(false);
  }
})(QueryForm);

const mapStateToProps = state => ({
  status: getQueryStatus(state)
});

QueryForm.propTypes = {
  fetchFilteredItemsAction: PropTypes.func.isRequired
};

const mapDispatchToProps = { fetchFilteredItemsAction: fetchFilteredItems };
export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(EnhancedForm));
