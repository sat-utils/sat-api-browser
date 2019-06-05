import { RSAA } from 'redux-api-middleware';
import * as types from '../constants/action_types';
import config from '../config';

export function fetchFilteredItems(filter) {
  const fetchAction = {
    type: types.FETCH_FILTERED_ITEMS,
    payload: filter
  };
  return {
    [RSAA]: {
      endpoint: `${config.endpoint}/stac/search`,
      method: 'POST',
      types: [
        fetchAction,
        types.FETCH_FILTERED_ITEMS_SUCCEEDED,
        types.FETCH_FILTERED_ITEMS_FAILED
      ],
      body: JSON.stringify(filter),
      headers: { 'content-type': 'application/json' },
    }
  };
}

export function setActiveFilterTab(tabIndex) {
  return {
    type: types.SET_ACTIVE_FILTER_TAB,
    payload: {
      tabIndex
    }
  };
}

export function addPropertyToQuery(property) {
  return {
    type: types.ADD_PROPERTY_TO_QUERY,
    payload: {
      property
    }
  };
}

export function removePropertyFromQuery(property) {
  return {
    type: types.REMOVE_PROPERTY_FROM_QUERY,
    payload: {
      property
    }
  };
}

export function addCandidate(candidate) {
  return {
    type: types.ADD_CANDIDATE,
    payload: {
      candidate
    }
  };
}
