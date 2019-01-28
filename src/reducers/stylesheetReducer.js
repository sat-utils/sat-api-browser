import { Map, fromJS } from 'immutable';
import bbox from '@turf/bbox';
import { featureCollection } from '@turf/helpers';
import centerOfMass from '@turf/center-of-mass';
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

function addIntegerIds(state, collection) {
  const highestId = state.get('highestId');
  const { features } = collection;
  const updatedFeatures = features.map((feature, index) => (
    Object.assign({}, feature, {
      stacId: feature.id,
      id: highestId + index + 1
    })
  ));
  const updatedCollection = Object.assign({}, collection,
    { features: updatedFeatures });
  return updatedCollection;
}

function createCentersCollection(features) {
  const centers = features.map((feature) => {
    const center = centerOfMass(feature);
    center.stacId = feature.stacId;
    center.id = feature.id;
    return center;
  });
  const centersCollection = featureCollection(centers);
  return centersCollection;
}

const setActiveImageItem = (state, payload) => {
  const { imageId } = payload;
  let newState;
  if (imageId === state.get('activeImageId')) {
    newState = state;
  } else {
    const {
      filteredItemsSource,
      //activeImageItemSource,
      //activeImageItem,
      activeImagePoint
    } = stylesheetConstants;

    const features = state
      .getIn([
        'style',
        'sources',
        filteredItemsSource,
        'data',
        'features']);

    const imageItem = features
      .find(feature => feature.get('id') === imageId);

    const imageItemJS = imageItem.toJS();
    const viewport = getViewport(state, imageItemJS);
    /* eslint-disable-next-line */
    //const href = imageItemJS.assets.primary.href;
    //const imagePath = url.parse(href).path.split('.')[0];
    //const tilePath = `https://tilerurl/${imagePath}`;

    newState = state.withMutations((tempState) => {
      tempState.set('activeImageItemId', imageId);
      tempState.setIn(['style', 'center'], fromJS(viewport.center));
      tempState.setIn(['style', 'zoom'], viewport.zoom - 0.5);
      //tempState.setIn(
        //['style', 'sources', activeImageItemSource, 'url'], tilePath
      //);
      //tempState.updateIn(
        //['style', 'layers'],
        //(layers) => {
          //const index = layers
            //.findIndex(layer => layer.get('id') === activeImageItem);
          //return layers.setIn([index, 'layout', 'visibility'], 'visible');
        //}
      //);
      tempState.updateIn(
        ['style', 'layers'],
        (layers) => {
          const index = layers
            .findIndex(layer => layer.get('id') === activeImagePoint);
          return layers.setIn([index, 'filter', 2], imageId);
        }
      );
    });
  }
  return newState;
};

function setFilteredDataSource(state, payload) {
  const { filteredItemsSource, imagePointsSource } = stylesheetConstants;
  const { json, filter } = payload;
  const collection = addIntegerIds(state, json);
  const newState = state.withMutations((tempState) => {
    const { features } = collection;
    const centersCollection = createCentersCollection(features);
    if (features.length) {
      const viewport = getViewport(state, json);
      tempState.setIn(['style', 'center'], fromJS(viewport.center));
      tempState.setIn(['style', 'zoom'], viewport.zoom - 0.5);
      tempState.set('highestId', state.get('highestId') + features.length);
    }
    if (filter.page) {
      tempState.mergeDeepIn(['style', 'sources', filteredItemsSource, 'data'],
        fromJS(collection));
      tempState.mergeDeepIn(['style', 'sources', imagePointsSource, 'data'],
        fromJS(centersCollection));
    } else {
      tempState.setIn(['style', 'sources', filteredItemsSource, 'data'],
        fromJS(collection));
      tempState.setIn(['style', 'sources', imagePointsSource, 'data'],
        fromJS(centersCollection));
    }
  });
  return newState;
}

const initialState = Map({
  style: fromJS({}),
  activeImageItemId: 0,
  highestId: 0,
  drawing: false
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

    case actions.SET_ACTIVE_IMAGE_ITEM: {
      return setActiveImageItem(state, action.payload);
    }

    case actions.START_DRAWING: {
      return state.merge({
        drawing: true
      });
    }

    case actions.DRAWING_COMPLETED: {
      return state.merge({
        drawing: false
      });
    }

    default: {
      return state;
    }
  }
}
