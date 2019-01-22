import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { setActiveQueryTab } from '../actions/queryActions';
import * as querySelectors from '../reducers/querySelectors';
import QueryForm from './QueryForm';
import ImageItems from './ImageItems';
import ResultsCount from './ResultsCount';

const styles = theme => ({
  tabs: {
    backgroundColor: theme.palette.grey[100]
  }
});
const QueryTabs = (props) => {
  const {
    activeTab,
    setActiveTab,
    resultsDisabled,
    classes
  } = props;
  let activeContent;
  if (activeTab === 0) {
    activeContent = <QueryForm />;
  }
  if (activeTab === 1) {
    activeContent = (
      <Fragment>
        <ResultsCount />
        <ImageItems />
      </Fragment>
    );
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
        <Tab
          label="Results"
          disabled={resultsDisabled}
        />
      </Tabs>
      {activeContent}
    </div>
  );
};

const mapStateToProps = state => ({
  activeTab: querySelectors.getActiveQueryTab(state),
  resultsDisabled: querySelectors.getResultsTabDisabled(state)
});

const mapDispatchToProps = {
  setActiveTab: setActiveQueryTab
};

QueryTabs.propTypes = {
  activeTab: PropTypes.number.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  resultsDisabled: PropTypes.bool.isRequired
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(QueryTabs));
