import { createSelector } from 'reselect';
import { getFilteredItems } from './stylesheetSelectors';
import { completed } from '../constants/applicationConstants';

const getActiveQueryTabState = state => state.query.get('activeQueryTab');
const getStatusState = state => state.query.get('status');

export const getActiveQueryTab = createSelector(
  [getActiveQueryTabState],
  activeQueryTab => activeQueryTab
);

export const getQueryStatus = createSelector(
  [getStatusState],
  status => status
);

export const getResultsTabDisabled = createSelector(
  [getStatusState, getFilteredItems],
  (status, filteredItems) => {
    let disabled;
    if (status === completed && filteredItems.size) {
      disabled = false;
    } else {
      disabled = true;
    }
    return disabled;
  }
);
