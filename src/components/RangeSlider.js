import React from 'react';
import { Range, Handle } from 'rc-slider';
import Tooltip from 'rc-tooltip';
import 'rc-slider/assets/index.css';

const handle = (props) => {
  const { value, dragging, index, ...restProps } = props;
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

const RangeSlider = (props) => {
  const { min, max } = props;
  const defaultMax = max / 2;
  return (
    <Range
      style={{ marginLeft: '5px', fontFamily: 'Roboto' }}
      allowCross={false}
      min={min}
      max={max}
      defaultValue={[min, defaultMax]}
      handle={handle}
      marks={{ [min]: min, [max]: max }}
      onChange={(value) => { console.log(value); }}
    />
  );
};

export default RangeSlider;
