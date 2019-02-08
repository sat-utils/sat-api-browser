import React, { Fragment } from 'react';
import { getIn } from 'formik';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const OperatorSelector = (props) => {
  const {
    name,
    handleChange,
    values,
    onlyEq
  } = props;

  const value = getIn(values, name);
  let menuItems;
  if (onlyEq) {
    menuItems = <MenuItem value="eq">Equal</MenuItem>;
  } else {
    menuItems = [
      <MenuItem value="eq">Equals</MenuItem>,
      <MenuItem value="lt">Less Than</MenuItem>,
      <MenuItem value="gt">Greater Than</MenuItem>
    ];
  }
  return (
    <Fragment>
      <Select
        name={name}
        value={onlyEq ? 'eq' : value}
        onChange={handleChange}
      >
        {menuItems}
      </Select>
    </Fragment>
  );
};
export default OperatorSelector;
