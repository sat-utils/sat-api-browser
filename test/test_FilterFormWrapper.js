import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import test from 'tape';
import sinon from 'sinon';
import { shallow, configure } from 'enzyme';
import { none } from '../src/constants/applicationConstants';
import { FilterFormWrapper } from '../src/components/FilterFormWrapper';

configure({ adapter: new Adapter() });

test('FilterFormWrapper', (t) => {
  const fetchFilteredItemsAction = sinon.spy();
  const startDrawingAction = sinon.spy();
  const props = {
    fetchFilteredItemsAction,
    startDrawingAction,
    status: none,
    bbox: [],
    drawing: false,
    classes: {},
  };

  const wrapper = shallow((<FilterFormWrapper {...props} />));
  const instance = wrapper.instance();
  let values = {
    startdatetime: new Date().toISOString().substring(0, 16),
    enddatetime: new Date().toISOString().substring(0, 16),
    queryFilters: {}
  };
  let errors = instance.validate(values);
  values = {
    startdatetime: new Date('1995-12-17T03:24:00').toISOString().substring(0, 16),
    enddatetime: new Date().toISOString().substring(0, 16),
    queryFilters: {}
  };
  t.ok(errors.startdatetime, 'Throws range error when dates are equal.');
  errors = instance.validate(values);
  t.equal(Object.keys(errors).length, 0, 'No errors with valid date range');
  values = {
    startdatetime: 'wat',
    enddatetime: 'wat',
    queryFilters: {}
  };
  errors = instance.validate(values);
  t.equal(Object.keys(errors).length, 2, 'Errors for invalid date strings');
  t.end();
});
