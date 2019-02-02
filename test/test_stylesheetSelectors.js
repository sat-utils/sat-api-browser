import test from 'tape';
import { fromJS } from 'immutable';
import { getStyle } from '../src/reducers/stylesheetSelectors';

test('getStyle', (t) => {
  const state = {
    stylesheet: fromJS({
      style: {
        center: [0, 0]
      }
    })
  };
  let style = getStyle(state);
  t.equal(style.get('center').get(0), 0,
    'Gets correct value from Immutable style');

  const updatedState = {
    stylesheet: state.stylesheet.setIn(['style', 'center'], fromJS([1, 1]))
  };
  style = getStyle(updatedState);
  t.equal(style.get('center').get(0), 1,
    'Gets correct value from Immutable style after modification');

  style = getStyle(updatedState);
  t.equal(getStyle.recomputations(), 2,
    'Only creates new value when input immutable style changes');

  t.end();
});
