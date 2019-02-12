import { createSelector } from 'reselect';
import { getFilteredItems } from './stylesheetSelectors';
import { completed } from '../constants/applicationConstants';

const getActiveFilterTabState = state => state.filter.get('activeFilterTab');
const getStatusState = state => state.filter.get('status');
const getCurrentFilterState = state => state.filter.get('currentFilter');
const getBboxState = state => state.filter.get('bbox');
const getQueryPropertiesState = state => state.filter.get('queryProperties');

export const getQueryProperties = createSelector(
  [getQueryPropertiesState],
  queryProperties => queryProperties
);

export const getActiveFilterTab = createSelector(
  [getActiveFilterTabState],
  activeFilterTab => activeFilterTab
);

export const getCurrentFilter = createSelector(
  [getCurrentFilterState],
  currentFilter => currentFilter
);

export const getFilterStatus = createSelector(
  [getStatusState],
  status => status
);

export const getBbox = createSelector(
  [getBboxState],
  bbox => bbox
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
