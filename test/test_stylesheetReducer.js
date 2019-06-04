import test from 'tape';
import { fromJS } from 'immutable';
import * as actions from '../src/constants/action_types';
import * as stylesheetConstants from '../src/constants/stylesheetConstants';
import stylesheetReducer from '../src/reducers/stylesheetReducer';
import stylesheet from './fixtures/stylesheet.json';
import items from './fixtures/items.json';

const {
  filteredItemsSource,
  imagePointsSource,
  activeImagePoint
} = stylesheetConstants;

function getBaseState() {
  const state = fromJS({
    style: stylesheet,
    activeImageItemId: 0,
    highestId: 0,
    drawing: false,
    clientSize: fromJS({
      clientWidth: 100,
      clientHeight: 100
    }),
    currentFilter: fromJS({})
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

test('stylesheetReducer', (t) => {
  const state = getBaseState();
  const action = {
    type: actions.FETCH_FILTERED_ITEMS_SUCCEEDED,
    payload: items
  };

  const fetchItemsState = stylesheetReducer(state, action);
  const actualFilteredItems = fetchItemsState.getIn(
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

  const highestId = fetchItemsState.get('highestId');
  t.equal(highestId, items.features.length, 'Sets new highestId index value');

  const centers = fetchItemsState.getIn(
    ['style', 'sources', imagePointsSource, 'data', 'features']
  );
  t.equal(centers.size, items.features.length,
    'Creates and loads centroid features for all the items');

  const setActiveAction = {
    type: actions.SET_ACTIVE_IMAGE_ITEM,
    payload: {
      imageId: 4
    }
  };

  const activeImageState = stylesheetReducer(fetchItemsState, setActiveAction);
  const layers = activeImageState.getIn(['style', 'layers']);
  const index = layers
    .findIndex(layer => layer.get('id') === activeImagePoint);
  const id = layers.getIn([index, 'filter', 2]);
  t.equal(id, setActiveAction.payload.imageId,
    'Sets filter on activeImagePoint layer');
  t.equal(activeImageState.get('activeImageItemId'),
    setActiveAction.payload.imageId, 'Set activeImageItemId value');
  t.end();
});


test('stylesheetReducer', (t) => {
  const state = getBaseState();
  const action = {
    type: actions.FETCH_FILTERED_ITEMS_SUCCEEDED,
    payload: items
  };
  const fetchItemsState = stylesheetReducer(state, action);
  const pageState = fetchItemsState.set('currentFilter', fromJS({ page: 1 }));

  const secondPageState = stylesheetReducer(pageState, action);

  const actualFilteredItems = secondPageState.getIn(
    ['style', 'sources', filteredItemsSource, 'data', 'features']
  );
  t.equal(actualFilteredItems.size, items.features.length * 2,
    'Updates filteredItemsSource with second page of features');
  t.end();
});
