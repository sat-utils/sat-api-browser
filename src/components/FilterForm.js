import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import CreateIcon from '@material-ui/icons/Create';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import green from '@material-ui/core/colors/green';
import DatePicker from './DatePicker';
import { loading, failed } from '../constants/applicationConstants';
import ProgressButton from './ProgressButton';
import PropertySelector from './PropertySelector';
import PropertyFilters from './PropertyFilters';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    marginLeft: 0
  },
  grid: {
    paddingTop: theme.spacing.unit * 3,
    paddingBottom: theme.spacing.unit * 3,
    overflowY: 'scroll'
  },
  submit: {
    textAlign: 'center'
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  label: {
    marginTop: theme.spacing.unit * 4
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  bboxChip: {
    backgroundColor: green[500],
    color: '#fff'
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
          <Grid container spacing={8}>
            <Grid item xs={6}>
              <DatePicker
                name="startdatetime"
                label="Start Date (required)"
                values={values}
                {...formikFieldProps}
              />
            </Grid>
            <Grid item xs={6}>
              <DatePicker
                name="enddatetime"
                label="End Date (required)"
                values={values}
                {...formikFieldProps}
              />
            </Grid>
          </Grid>

          <FormLabel
            component="legend"
            className={classes.label}
          >
            Area Of Interest (required)
          </FormLabel>
          <Button
            variant="contained"
            size="small"
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
          <FormLabel
            component="legend"
            className={classes.label}
          >
            Property Filters
          </FormLabel>
          <PropertyFilters
            values={values}
            {...formikFieldProps}
          />
          <PropertySelector />
          <div className={classes.submit}>
            <ProgressButton
              type="submit"
              disabled={!isValid || !bbox || status === loading}
              label="Submit Query"
              status={status}
              onClick={handleSubmit}
            />
          </div>
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
