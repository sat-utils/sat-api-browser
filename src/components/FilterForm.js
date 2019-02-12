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
import DatePicker from './DatePicker';
import { loading, failed } from '../constants/applicationConstants';
import ProgressButton from './ProgressButton';
import PropertySelector from './PropertySelector';
import PropertyFilters from './PropertyFilters';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  grid: {
    marginTop: theme.spacing.unit * 3,
    maxHeight: 'calc(100vh - 220px)',
    overflowY: 'scroll'
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

export const FilterForm = (props) => {
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
          <DatePicker
            name="startdatetime"
            label="Start Date"
            values={values}
            {...formikFieldProps}
          />
          <DatePicker
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
          <FormLabel
            component="legend"
            className={classes.label}
          >
            Property Filters
          </FormLabel>
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
            name="filter-form"
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

FilterForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  setValues: PropTypes.func.isRequired,
  isValid: PropTypes.bool.isRequired,
  status: PropTypes.string.isRequired,
  startDrawingAction: PropTypes.func.isRequired,
  bbox: PropTypes.array,
  drawing: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FilterForm);
