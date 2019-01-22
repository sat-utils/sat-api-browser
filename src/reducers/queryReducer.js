import { Map } from 'immutable';
import * as actions from '../constants/action_types';
import { loading, none, completed } from '../constants/applicationConstants';

const initialState = Map({
  activeQueryTab: 0,
  status: none
});

export default function queryReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_ACTIVE_QUERY_TAB: {
      return state.merge({
        activeQueryTab: action.payload.tabIndex
      });
    }
    case actions.FETCH_FILTERED_ITEMS: {
      return state.merge({
        status: loading
      });
    }
    case actions.FETCH_FILTERED_ITEMS_SUCCEEDED: {
      return state.merge({
        status: completed,
        activeQueryTab: 1
      });
    }
    default: {
      return state;
    }
  }
}
