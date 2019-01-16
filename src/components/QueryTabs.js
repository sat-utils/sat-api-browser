import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { setActiveQueryTab } from '../actions/applicationActions';
import * as applicationSelectors from '../reducers/applicationSelectors';

const QueryTabs = (props) => {
  const { activeTab, setActiveTab } = props;
  return (
    <Tabs
      value={activeTab}
      indicatorColor="primary"
      textColor="primary"
      variant="fullWidth"
      onChange={(event, index) => setActiveTab(index)}
    >
      <Tab label="Build Query" />
      <Tab label="Results" />
    </Tabs>
  );
};

const mapStateToProps = state => ({
  activeTab: applicationSelectors.getActiveQueryTab(state)
});

const mapDispatchToProps = {
  setActiveTab: setActiveQueryTab
};

export default connect(mapStateToProps, mapDispatchToProps)(QueryTabs);
