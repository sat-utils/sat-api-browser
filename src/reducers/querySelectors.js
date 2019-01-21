import { createSelector } from 'reselect';

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
