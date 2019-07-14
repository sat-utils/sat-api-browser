import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import test from 'tape';
import { shallow, configure } from 'enzyme';
import { ResultsPaging } from '../src/components/ResultsPaging';
import ProgressButton from '../src/components/ProgressButton';

configure({ adapter: new Adapter() });

test('ResultsPaging getMoreResults enabled', (t) => {
  process.env.REACT_APP_RESULT_LIMIT = 10;
  const props = {
    classes: {},
    resultsTotal: 20,
    resultsDisplayed: 0,
    currentFilter: {},
    fetchFilteredItemsAction: () => {},
    status: ''
  };

  let wrapper = shallow((<ResultsPaging {...props} />));
  let moreResults = wrapper.find(ProgressButton);
  t.ok(moreResults.length,
    'More results enabled when resultsTotal is valid');

  props.resultsTotal = undefined;
  wrapper = shallow((<ResultsPaging {...props} />));
  moreResults = wrapper.find(ProgressButton);
  t.notOk(moreResults.length,
    'More results is not rendered when resultsTotal is undefined');

  t.end();
});
