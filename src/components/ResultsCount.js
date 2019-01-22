import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import { getResultsTotal } from '../reducers/stylesheetSelectors';

const styles = theme => ({
  grid: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  },
  chips: {
    textAlign: 'center'
  }
});

export const ResultsCount = (props) => {
  const {
    classes,
    resultsTotal,
    resultsCurrent
  } = props;
  return (
    <Grid
      container
      justify="center"
      className={classes.grid}
    >
      <Grid item xs={8}>
        <div className={classes.chips}>
          <Chip
            color="primary"
            label={`Total Results Found - ${resultsTotal}`}
          />
          <Chip
            color="secondary"
            label="Load More Results"
          />
        </div>
      </Grid>
    </Grid>
  );
};

const mapStateToProps = state => ({
  resultsTotal: getResultsTotal(state)
});

export default withStyles(styles)(connect(mapStateToProps)(ResultsCount));
