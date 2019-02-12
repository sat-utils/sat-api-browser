import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { getIn } from 'formik';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { none } from '../constants/applicationConstants';

const OperatorSelector = (props) => {
  const {
    name,
    handleChange,
    values,
    onlyEq,
  } = props;

  const value = getIn(values, name);
  let menuItems;
  if (onlyEq) {
    menuItems = [
      <MenuItem key={none} value={none} />,
      <MenuItem key="eq" value="eq">=</MenuItem>
    ];
  } else {
    menuItems = [
      <MenuItem key={none} value={none} />,
      <MenuItem key="eq" value="eq">=</MenuItem>,
      <MenuItem key="gt" value="gt">{'>'}</MenuItem>,
      <MenuItem key="lt" value="lt">{'<'}</MenuItem>,
      <MenuItem key="gte" value="gte">{'>='}</MenuItem>,
      <MenuItem key="lte" value="lte">{'<='}</MenuItem>
    ];
  }
  return (
    <Fragment>
      <Select
        name={name}
        value={value || 'none'}
        onChange={handleChange}
      >
        {menuItems}
      </Select>
    </Fragment>
  );
};

OperatorSelector.propTypes = {
  name: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  onlyEq: PropTypes.bool.isRequired
};

export default OperatorSelector;
