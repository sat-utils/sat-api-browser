import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { setActiveQueryTab } from '../actions/applicationActions';
import * as applicationSelectors from '../reducers/applicationSelectors';
import QueryForm from './QueryForm';

const styles = theme => ({
  tabs: {
    backgroundColor: theme.palette.grey[100]
  }
});
const QueryTabs = (props) => {
  const { activeTab, setActiveTab, classes } = props;
  let activeContent;
  if (activeTab === 0) {
    activeContent = <QueryForm />;
  }
  if (activeTab === 1) {
    activeContent = <div>Results</div>;
  }
  return (
    <div>
      <Tabs
        value={activeTab}
        indicatorColor="primary"
        className={classes.tabs}
        textColor="primary"
        variant="fullWidth"
        onChange={(event, index) => setActiveTab(index)}
      >
        <Tab label="Build Query" />
        <Tab label="Results" />
      </Tabs>
      {activeContent}
    </div>
  );
};

const mapStateToProps = state => ({
  activeTab: applicationSelectors.getActiveQueryTab(state)
});

const mapDispatchToProps = {
  setActiveTab: setActiveQueryTab
};

QueryTabs.propTypes = {
  activeTab: PropTypes.number.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  classes: PropTypes.shape({
    root: PropTypes.string.isRequired
  }).isRequired
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(QueryTabs));
