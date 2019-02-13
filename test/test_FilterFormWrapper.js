import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import test from 'tape';
import sinon from 'sinon';
import { fromJS } from 'immutable';
import { shallow, configure } from 'enzyme';
import { none } from '../src/constants/applicationConstants';
import { FilterFormWrapper } from '../src/components/FilterFormWrapper';

configure({ adapter: new Adapter() });

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
    queryProperties: fromJS(queryProperties)
  };
  return {
    fetchFilteredItemsAction,
    startDrawingAction,
    props,
    minimum,
    maximum
  };
}

test('FilterFormWrapper date validation', (t) => {
  const { props } = setup();
  const wrapper = shallow((<FilterFormWrapper {...props} />));
  const instance = wrapper.instance();

  let values = {
    startdatetime: new Date().toISOString().substring(0, 16),
    enddatetime: new Date().toISOString().substring(0, 16),
    queryFilters: {}
  };
  let errors = instance.validate(values);
  t.ok(errors.startdatetime, 'Reports range error when dates are equal.');

  values = {
    startdatetime: new Date('1995-12-17T03:24:00').toISOString().substring(0, 16),
    enddatetime: new Date().toISOString().substring(0, 16),
    queryFilters: {}
  };
  errors = instance.validate(values);
  t.equal(Object.keys(errors).length, 0, 'No errors with valid date range');

  values = {
    startdatetime: 'wat',
    enddatetime: 'wat',
    queryFilters: {}
  };
  errors = instance.validate(values);
  t.equal(Object.keys(errors).length, 2, 'Reports errors for invalid date strings');

  t.end();
});

test('FilterFormWrapper query filter validation', (t) => {
  const { props } = setup();
  const wrapper = shallow((<FilterFormWrapper {...props} />));
  const instance = wrapper.instance();

  let values = {
    queryFilters: {
      'eo:collection': {
        operator: 'eq',
        value: ''
      }
    }
  };
  let errors = instance.validate(values);
  t.ok(errors.queryFilters['eo:collection'].value,
    'Reports error when string value for query filter is empty string.');

  values = {
    queryFilters: {
      'eo:collection': {
        operator: 'eq',
        value: 'landsat'
      }
    }
  };
  errors = instance.validate(values);
  t.notOk(errors.queryFilters,
    'No error for valid string value');
  t.end();
});

test('FilterFormWrapper query filter range validation', (t) => {
  const { props } = setup();
  const wrapper = shallow((<FilterFormWrapper {...props} />));
  const instance = wrapper.instance();

  let values = {
    queryFilters: {
      'eo:cloud_cover': {
        operator: 'eq',
        value: 120
      }
    }
  };
  let errors = instance.validate(values);
  t.ok(errors.queryFilters['eo:cloud_cover'].value,
    'Reports range error when value falls outside of min max.');

  values = {
    queryFilters: {
      'eo:cloud_cover': {
        operator: 'eq',
        value: 90
      }
    }
  };
  errors = instance.validate(values);
  t.notOk(errors.queryFilters,
    'No error when value falls inside of min max.');
  t.end();
});
