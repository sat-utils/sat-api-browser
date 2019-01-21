import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import { loading } from '../constants/applicationConstants';
import { getQueryStatus } from '../reducers/querySelectors';

const QueryProgress = (props) => {
  const { status } = props;
  let progress;
  if (status === loading) {
    progress = <CircularProgress />;
  } else {
    progress = <div />;
  }
  return progress;
};

const mapStateToProps = state => ({
  status: getQueryStatus(state)
});

QueryProgress.propTypes = {
  status: PropTypes.string.isRequired
};

export default connect(mapStateToProps)(QueryProgress);
