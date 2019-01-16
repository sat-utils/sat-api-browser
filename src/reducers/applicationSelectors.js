import { createSelector } from 'reselect';

const getActiveQueryTabState = state => state.application.get('activeQueryTab');

export const getActiveQueryTab = createSelector(
  [getActiveQueryTabState],
  activeQueryTab => activeQueryTab
);
