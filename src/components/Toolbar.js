import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import LogoIcon from './LogoIcon';

const styles = () => ({
  logoIcon: {
    marginLeft: -12,
    marginRight: 20,
    fontSize: 40
  }
});

const ApplicationToolbar = (props) => {
  const { classes } = props;
  return (
    <Toolbar>
      <LogoIcon className={classes.logoIcon} />
      <Typography
        variant="h6"
        color="inherit"
      >
        SAT-API Browser
      </Typography>
    </Toolbar>
  );
};

ApplicationToolbar.propTypes = {
  classes: PropTypes.shape({
    logoIcon: PropTypes.string.isRequired,
  }).isRequired
};
export default withStyles(styles)(ApplicationToolbar);
