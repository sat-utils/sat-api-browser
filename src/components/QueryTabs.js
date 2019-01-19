import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { setActiveQueryTab } from '../actions/applicationActions';
import * as applicationSelectors from '../reducers/applicationSelectors';
import QueryForm from './QueryForm';

const QueryTabs = (props) => {
  const { activeTab, setActiveTab } = props;
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
  setActiveTab: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(QueryTabs);
