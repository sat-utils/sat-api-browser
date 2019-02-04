import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import blue from '@material-ui/core/colors/blue';
import Button from '@material-ui/core/Button';
import { loading } from '../constants/applicationConstants';

const styles = theme => ({
  wrapper: {
    margin: theme.spacing.unit,
    position: 'relative',
  },
  buttonProgress: {
    color: blue[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
});

export const ProgressButton = (props) => {
  const {
    classes,
    status,
    label,
    onClick,
    ...other
  } = props;

  return (
    <div className={classes.wrapper}>
      <Button
        variant="contained"
        color="primary"
        onClick={onClick}
        {...other}
      >
        {label}
      </Button>
      {status === loading
        && <CircularProgress size={24} className={classes.buttonProgress} />}
    </div>
  );
};

ProgressButton.propTypes = {
  classes: PropTypes.object.isRequired,
  status: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

export default withStyles(styles)(ProgressButton);
