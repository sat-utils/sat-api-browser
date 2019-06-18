import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { setActiveFilterTab } from '../actions/filterActions';
import * as filterSelectors from '../reducers/filterSelectors';
import FilterFormWrapper from './FilterFormWrapper';
import ImageItems from './ImageItems';
import ResultsPaging from './ResultsPaging';

const styles = theme => ({
  tabs: {
    backgroundColor: theme.palette.grey[100]
  }
});
const FilterTabs = (props) => {
  const {
    activeTab,
    setActiveTab,
    resultsDisabled,
    classes
  } = props;
  let activeContent;
  if (activeTab === 0) {
    activeContent = <FilterFormWrapper />;
  }
  if (activeTab === 1) {
    activeContent = (
      <Fragment>
        <ResultsPaging />
        <ImageItems />
      </Fragment>
    );
  }
  return (
    <React.Fragment>
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
        <Tab
          label="Candidates"
          disabled
        />
      </Tabs>
      {activeContent}
    </React.Fragment>
  );
};

const mapStateToProps = state => ({
  activeTab: filterSelectors.getActiveFilterTab(state),
  resultsDisabled: filterSelectors.getResultsTabDisabled(state)
});

const mapDispatchToProps = {
  setActiveTab: setActiveFilterTab
};

FilterTabs.propTypes = {
  activeTab: PropTypes.number.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  resultsDisabled: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(FilterTabs));
