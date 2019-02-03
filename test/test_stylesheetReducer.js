import test from 'tape';
import { fromJS } from 'immutable';
import * as actions from '../src/constants/action_types';
import * as stylesheetConstants from '../src/constants/stylesheetConstants';
import stylesheetReducer from '../src/reducers/stylesheetReducer';
import stylesheet from './fixtures/stylesheet.json';
import items from './fixtures/items.json';

function getBaseState() {
  const state = fromJS({
    style: stylesheet,
    activeImageItemId: 0,
    highestId: 0,
    drawing: false,
    clientSize: fromJS({
      clientWidth: 100,
      clientHeight: 100
    })
  });
  return state;
}

test('stylesheetReducer set style', (t) => {
  const action = {
    type: actions.SET_STYLE,
    payload: {
      style: stylesheet
    }
  };
  const state = stylesheetReducer(undefined, action);
  const actualStyle = state.get('style').toJS();
  t.deepEqual(actualStyle, stylesheet);
  t.end();
});

test('stylesheet fetch items', (t) => {
  const state = getBaseState();
  const action = {
    type: actions.FETCH_FILTERED_ITEMS_SUCCEEDED,
    payload: {
      json: items,
      filter: {}
    }
  };

  const newState = stylesheetReducer(state, action);
  const { filteredItemsSource, imagePointsSource } = stylesheetConstants;
  const actualFilteredItems = newState.getIn(
    ['style', 'sources', filteredItemsSource, 'data', 'features']
  );
  t.equal(actualFilteredItems.size, items.features.length,
    'Loads all the items into filteredItemsSource');

  const lastItemCalculatedId = actualFilteredItems.getIn(
    [items.features.length - 1, 'id']
  );
  const lastItemStacId = actualFilteredItems.getIn(
    [items.features.length - 1, 'stacId']
  );
  t.ok(lastItemStacId, 'Converts orignial id to stacId');
  t.equal(lastItemCalculatedId, items.features.length,
    'Calculates new index based ids for use with MapboxGL featurestate');

  const highestId = newState.get('highestId');
  t.equal(highestId, items.features.length, 'Sets new highestId index value');

  const centers = newState.getIn(
    ['style', 'sources', imagePointsSource, 'data', 'features']
  );
  t.equal(centers.size, items.features.length,
    'Creates and loads centroid features for all the items');
  t.end();
});
