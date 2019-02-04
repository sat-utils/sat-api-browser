import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import test from 'tape';
import sinon from 'sinon';
import { shallow, configure } from 'enzyme';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { loading, none } from '../src/constants/applicationConstants';
import { ProgressButton } from '../src/components/ProgressButton';

configure({ adapter: new Adapter() });

test('ProgressButton', (t) => {
  const onClick = sinon.spy();
  const props = {
    onClick,
    classes: {},
    status: loading,
    label: 'label'
  };
  let wrapper = shallow((<ProgressButton {...props} />));
  t.equal(
    wrapper.find(Button).length, 1,
    'ImageItem always displays button'
  );
  t.equal(
    wrapper.find(CircularProgress).length, 1,
    'Renders CircularProgress when status is loading'
  );
  props.status = none;
  wrapper = shallow((<ProgressButton {...props} />));
  t.equal(
    wrapper.find(CircularProgress).length, 0,
    'No CircularProgress when status is not loading'
  );
  t.end();
});
