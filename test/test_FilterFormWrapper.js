import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import test from 'tape';
import sinon from 'sinon';
import { fromJS } from 'immutable';
import { shallow, configure } from 'enzyme';
import { none } from '../src/constants/applicationConstants';
// import { FilterFormWrapper } from '../src/components/FilterFormWrapper';

configure({ adapter: new Adapter() });
const proxyquire = require('proxyquire').noCallThru();

function setup() {
  const fetchFilteredItemsAction = sinon.spy();
  const startDrawingAction = sinon.spy();
  const minimum = 0;
  const maximum = 100;
  const queryProperties = {
    'eo:collection': {
      type: 'string'
    },
    'eo:cloud_cover': {
      type: 'number',
      minimum,
      maximum
    }
  };
  const props = {
    fetchFilteredItemsAction,
    startDrawingAction,
    status: none,
    bbox: [],
    drawing: false,
    classes: {},
    queryProperties: fromJS(queryProperties),
    currentFilter: fromJS({})
  };

  const { FilterFormWrapper } = proxyquire(
    '../src/components/FilterFormWrapper',
    {
      './FilterForm': () => (<div />)
    }
  );

  return {
    fetchFilteredItemsAction,
    startDrawingAction,
    props,
    minimum,
    maximum,
    FilterFormWrapper
  };
}

test('FilterFormWrapper date validation', (t) => {
  const { props, FilterFormWrapper } = setup();
  const wrapper = shallow((<FilterFormWrapper {...props} />));
  const instance = wrapper.instance();

  let values = {
    startdatetime: new Date().toISOString().substring(0, 16),
    enddatetime: new Date().toISOString().substring(0, 16),
    query: {}
  };
  let errors = instance.validate(values);
  t.ok(errors.startdatetime, 'Reports range error when dates are equal.');

  values = {
    startdatetime: new Date('1995-12-17T03:24:00').toISOString().substring(0, 16),
    enddatetime: new Date().toISOString().substring(0, 16),
    query: {}
  };
  errors = instance.validate(values);
  t.equal(Object.keys(errors).length, 0, 'No errors with valid date range');

  values = {
    startdatetime: 'wat',
    enddatetime: 'wat',
    query: {}
  };
  errors = instance.validate(values);
  t.equal(Object.keys(errors).length, 2, 'Reports errors for invalid date strings');

  t.end();
});

test('FilterFormWrapper query filter validation', (t) => {
  const { props, FilterFormWrapper } = setup();
  const wrapper = shallow((<FilterFormWrapper {...props} />));
  const instance = wrapper.instance();

  let values = {
    query: {
      'eo:collection': {
        eq: ''
      }
    }
  };
  let errors = instance.validate(values);
  t.ok(errors.query['eo:collection'],
    'Reports error when string value for query filter is empty string.');

  values = {
    query: {
      'eo:collection': {
        eq: 'test'
      }
    }
  };
  errors = instance.validate(values);
  t.notOk(errors.query,
    'No error for valid string value');
  t.end();
});

test('FilterFormWrapper query filter range validation', (t) => {
  const { props, FilterFormWrapper } = setup();
  const wrapper = shallow((<FilterFormWrapper {...props} />));
  const instance = wrapper.instance();

  let values = {
    query: {
      'eo:cloud_cover': {
        gte: 20,
        lte: 120
      }
    }
  };
  let errors = instance.validate(values);
  t.ok(errors.query['eo:cloud_cover'],
    'Reports range error when value falls outside of min max.');

  values = {
    query: {
      'eo:cloud_cover': {
        gte: 20,
        lte: 40
      }
    }
  };
  errors = instance.validate(values);
  t.notOk(errors.query,
    'No error when value range inside of min max.');
  t.end();
});
