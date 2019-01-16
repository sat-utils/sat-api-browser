import { Map } from 'immutable';
import * as actions from '../constants/action_types';

const initialState = Map({
  activeQueryTab: 0
});

export default function applicationReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_ACTIVE_QUERY_TAB: {
      return state.merge({
        activeQueryTab: action.payload.tabIndex
      });
    }

    default: {
      return state;
    }
  }
}
