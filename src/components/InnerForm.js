import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import CreateIcon from '@material-ui/icons/Create';
import Chip from '@material-ui/core/Chip';
import PictureIcon from '@material-ui/icons/PictureInPicture';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { Persist } from 'formik-persist';
import FormikDatePicker from './FormikDatePicker';
import { loading, failed } from '../constants/applicationConstants';
import ProgressButton from './ProgressButton';
import PropertySelector from './PropertySelector';
import PropertyFilters from './PropertyFilters';

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

export const InnerForm = (props) => {
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
    queryProperties,
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
          <PropertySelector />
          <PropertyFilters
            values={values}
            {...formikFieldProps}
          />
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

InnerForm.propTypes = {
  fetchFilteredItemsAction: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  setValues: PropTypes.func.isRequired,
  isValid: PropTypes.bool.isRequired,
  status: PropTypes.string.isRequired,
  startDrawingAction: PropTypes.func.isRequired,
  bbox: PropTypes.array,
  drawing: PropTypes.bool.isRequired
};

export default withStyles(styles)(InnerForm);
