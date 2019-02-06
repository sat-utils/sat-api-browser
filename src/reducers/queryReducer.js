import { Map, fromJS } from 'immutable';
import bbox from '@turf/bbox';
import * as actions from '../constants/action_types';
import {
  loading,
  none,
  completed,
  failed
} from '../constants/applicationConstants';

const initialState = Map({
  activeQueryTab: 0,
  status: none,
  currentFilter: fromJS({}),
  queryProperties: fromJS({})
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
      const { payload: { filter } } = action;
      return state.merge({
        status: completed,
        activeQueryTab: 1,
        currentFilter: fromJS(filter)
      });
    }
    case actions.FETCH_FILTERED_ITEMS_FAILED: {
      return state.merge({
        status: failed
      });
    }
    case actions.DRAWING_COMPLETED: {
      const { payload: { feature } } = action;
      const bounds = bbox(feature);
      return state.merge({
        bbox: bounds
      });
    }

    case actions.ADD_PROPERTY_TO_QUERY: {
      const { payload: { property } } = action;
      return state.setIn(['queryProperties', property.name], fromJS(property));
    }

    default: {
      return state;
    }
  }
}
