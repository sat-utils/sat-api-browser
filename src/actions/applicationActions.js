import { SET_ACTIVE_QUERY_TAB } from '../constants/action_types';

export function setActiveQueryTab(tabIndex) {
  return {
    type: SET_ACTIVE_QUERY_TAB,
    payload: {
      tabIndex
    }
  };
}
