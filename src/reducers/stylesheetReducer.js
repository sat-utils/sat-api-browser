import { Map, fromJS } from 'immutable';
import bbox from '@turf/bbox';
import centerOfMass from '@turf/center-of-mass';
import { featureCollection } from '@turf/helpers';
import geoViewport from '@mapbox/geo-viewport';
import * as actions from '../constants/action_types';
import * as stylesheetConstants from '../constants/stylesheetConstants';

const getViewport = (state, geoJSON) => {
  const bounds = bbox(geoJSON);
  const clientSize = state.get('clientSize');
  const dimensions = [
    clientSize.get('clientWidth'),
    clientSize.get('clientHeight')
  ];
  const viewport = geoViewport.viewport(
    bounds,
    dimensions,
    undefined,
    undefined,
    512,
    true
  );
  return viewport;
};

const setFilteredDataSource = (state, payload) => {
  const { filteredItemsSource, imagePointsSource } = stylesheetConstants;
  const { json } = payload;
  const newState = state.withMutations((tempState) => {
    const centers = json.features.map(feature => (centerOfMass(feature)));
    const centerFeatureCollection = featureCollection(centers);
    if (json.features.length) {
      const viewport = getViewport(state, json);
      tempState.setIn(['style', 'center'], fromJS(viewport.center));
      tempState.setIn(['style', 'zoom'], viewport.zoom - 0.5);
    }
    tempState.setIn(['style', 'sources', filteredItemsSource, 'data'],
      fromJS(json));
    tempState.setIn(['style', 'sources', imagePointsSource, 'data'],
      fromJS(centerFeatureCollection));
  });
  return newState;
};

const initialState = Map({
  style: fromJS({}),
  activeImageItemId: 0
});

export default function stylesheetReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STYLE: {
      return state.merge({
        style: fromJS(action.payload.style)
      });
    }

    case actions.FETCH_FILTERED_ITEMS_SUCCEEDED: {
      return setFilteredDataSource(state, action.payload);
    }

    case actions.SET_CLIENT_SIZE: {
      return state.merge({
        clientSize: fromJS(action.payload)
      });
    }

    default: {
      return state;
    }
  }
}
