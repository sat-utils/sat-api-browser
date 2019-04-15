import React from 'react';
import PropTypes from 'prop-types';
import { Range, Handle } from 'rc-slider';
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
  componentDidMount() {
    const {
      name,
      min,
      max,
      setFieldValue
    } = this.props;

    const defaultMax = max / 2;
    setFieldValue(`${name}.gte`, min);
    setFieldValue(`${name}.lte`, defaultMax);
  }

  render() {
    const {
      name,
      min,
      max,
      setFieldValue
    } = this.props;

    const defaultMax = max / 2;

    return (
      <Range
        name={name}
        style={{ marginLeft: '10px', fontFamily: 'Roboto' }}
        allowCross={false}
        min={min}
        max={max}
        defaultValue={[min, defaultMax]}
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
  setFieldValue: PropTypes.func.isRequired
};

export default RangeSlider;
