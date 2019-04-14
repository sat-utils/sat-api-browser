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
  activeFilterTab: 0,
  status: none,
  currentFilter: fromJS({}),
  queryProperties: fromJS({})
});

export default function filterReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_ACTIVE_FILTER_TAB: {
      return state.merge({
        activeFilterTab: action.payload.tabIndex
      });
    }
    case actions.FETCH_FILTERED_ITEMS: {
      const { payload } = action;
      return state.merge({
        status: loading,
        currentFilter: fromJS(payload)
      });
    }
    case actions.FETCH_FILTERED_ITEMS_SUCCEEDED: {
      return state.merge({
        status: completed,
        activeFilterTab: 1
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
