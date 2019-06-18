import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import DateFnsUtils from '@date-io/date-fns';

import Toolbar from './Toolbar';
import FilterTabs from './FilterTabs';
import Map from './Map';

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  sidebar: {
    color: theme.palette.text.secondary,
    display: 'flex',
    flexFlow: 'column',
    height: '100%'
  },
  mainContainer: {
    height: 'calc(100vh - 64px)',
    marginTop: '64px'
  }
});

export const Container = (props) => {
  const { classes } = props;
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <div className={classes.root}>
        <AppBar
          position="fixed"
          color="default"
          className={classes.appBar}
        >
          <Toolbar />
        </AppBar>
        <Grid container spacing={0} className={classes.mainContainer}>
          <Grid
            className={classes.sidebar}
            item
            xs={12}
            sm={6}
          >
            <FilterTabs />
          </Grid>
          <Grid
            item
            xs={1}
            sm={6}
          >
            <Map />
          </Grid>
        </Grid>
      </div>
    </MuiPickersUtilsProvider>
  );
};

Container.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Container);
