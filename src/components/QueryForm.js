import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withFormik } from 'formik';
import { withStyles } from '@material-ui/core/styles';
import { Persist } from 'formik-persist';
import Grid from '@material-ui/core/Grid';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import CreateIcon from '@material-ui/icons/Create';
import Chip from '@material-ui/core/Chip';
import PictureIcon from '@material-ui/icons/PictureInPicture';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import FormikDatePicker from './FormikDatePicker';
import { fetchFilteredItems } from '../actions/queryActions';
import { startDrawing } from '../actions/stylesheetActionCreators';
import { getQueryStatus, getBbox } from '../reducers/querySelectors';
import { getDrawing } from '../reducers/stylesheetSelectors';
import { loading, failed } from '../constants/applicationConstants';
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
  },
  label: {
    marginTop: theme.spacing.unit * 2
  },
  error: {
    backgroundColor: theme.palette.error.dark,
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
    startDrawingAction,
    bbox,
    drawing,
    ...formikFieldProps
  } = props;
  let bboxCoords;
  if (bbox) {
    bboxCoords = (
      <Chip
        icon={<PictureIcon />}
        label="BBOX"
      />
    );
  } else {
    bboxCoords = <div />;
  }
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
          <FormLabel
            component="legend"
            className={classes.label}
          >
            Area Of Interest
          </FormLabel>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            disabled={drawing}
            onClick={startDrawingAction}
          >
            Draw Bbox on Map
            <CreateIcon
              className={classes.rightIcon}
            />
          </Button>
          {bboxCoords}
          <br />
          <br />
          <div className={classes.submit}>
            <ProgressButton
              type="submit"
              disabled={!isValid || !bbox || status === loading}
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
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={status === failed}
      >
        <SnackbarContent
          className={classes.error}
          aria-describedby="client-snackbar"
          message={<span id="message-id">There was an error with your query</span>}
        />
      </Snackbar>
    </Grid>
  );
};

const EnhancedForm = withFormik({
  mapPropsToValues: () => ({
    startdatetime: new Date().toISOString().substring(0, 16),
    enddatetime: new Date().toISOString().substring(0, 16),
  }),

  validate: (values) => {
    const errors = {};
    if (values.startdatetime >= values.enddatetime) {
      errors.startdatetime = 'Start Date must be before End Date';
    }
    const dateRegex = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9])?$/;
    const invalidDateMessage = 'Must be a valid date and time';
    const startValid = dateRegex.test(values.startdatetime);
    if (!startValid) {
      errors.startdatetime = invalidDateMessage;
    }
    const endValid = dateRegex.test(values.enddatetime);
    if (!endValid) {
      errors.enddatetime = invalidDateMessage;
    }
    return errors;
  },

  handleSubmit: (values, { props, setSubmitting }) => {
    const {
      fetchFilteredItemsAction,
      bbox
    } = props;

    const {
      startdatetime,
      enddatetime
    } = values;

    const filter = {
      limit,
      bbox,
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
  status: getQueryStatus(state),
  bbox: getBbox(state),
  drawing: getDrawing(state)
});

QueryForm.propTypes = {
  fetchFilteredItemsAction: PropTypes.func.isRequired
};

const mapDispatchToProps = {
  fetchFilteredItemsAction: fetchFilteredItems,
  startDrawingAction: startDrawing
};
export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(EnhancedForm));
