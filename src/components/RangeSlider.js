import React from 'react';
import PropTypes from 'prop-types';
import { Range, Handle } from 'rc-slider';
import { getIn } from 'formik';
import Tooltip from 'rc-tooltip';
import 'rc-slider/assets/index.css';

const handle = (props) => {
  const {
    value,
    dragging,
    index,
    ...restProps
  } = props;

  return (
    <Tooltip
      overlayStyle={{ fontFamily: 'Roboto' }}
      prefixCls="rc-slider-tooltip"
      overlay={value}
      visible={dragging}
      placement="top"
      key={index}
    >
      <Handle value={value} {...restProps} />
    </Tooltip>
  );
};

class RangeSlider extends React.Component {
  render() {
    const {
      name,
      min,
      max,
      setFieldValue,
      values
    } = this.props;

    const defaultMax = max / 2;
    const minValue = getIn(values, `${name}.gte`) || min;
    const maxValue = getIn(values, `${name}.lte`) || defaultMax;

    return (
      <Range
        name={name}
        style={{ marginLeft: '10px', fontFamily: 'Roboto' }}
        allowCross={false}
        min={min}
        max={max}
        defaultValue={[minValue, maxValue]}
        handle={handle}
        marks={{ [min]: min, [max]: max }}
        onAfterChange={(minmax) => {
          setFieldValue(`${name}.gte`, minmax[0]);
          setFieldValue(`${name}.lte`, minmax[1]);
        }}
      />
    );
  }
}

RangeSlider.propTypes = {
  name: PropTypes.string.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  setFieldValue: PropTypes.func.isRequired,
  values: PropTypes.object
};

export default RangeSlider;
