import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import { addPropertyToQuery } from '../actions/queryActions';
import { getQueryProperties } from '../reducers/querySelectors';
import eo from '../stac_schemas/eo';

const PropertySelector = (props) => {
  const { addPropertyToQueryAction, queryProperties } = props;
  // eslint-disable-next-line
  const properties = eo.definitions.eo.allOf[1].properties.properties.properties;
  const validProperties = Object.keys(properties).reduce((accum, key) => {
    const property = properties[key];
    const { type } = property;
    if (type === 'number' || type === 'string') {
      property.name = key;
      // Disable previously selected properties
      if (queryProperties.get(key)) {
        property.disabled = true;
      }
      accum.push(property);
    }
    return accum;
  }, []);
  const menuItems = validProperties.map(property => (
    <MenuItem
      key={property.name}
      value={property}
      disabled={property.disabled}
    >
      {property.title}
    </MenuItem>
  ));
  menuItems.unshift(
    <MenuItem
      key="None"
      value="None"
      disabled
    >
      Pick a property
    </MenuItem>
  );
  return (
    <Fragment>
      <Select
        value="None"
        onChange={(event) => {
          addPropertyToQueryAction(event.target.value);
        }}
      >
        {menuItems}
      </Select>
      <FormHelperText>Add a property to filter</FormHelperText>
    </Fragment>
  );
};

PropertySelector.propTypes = {
  addPropertyToQueryAction: PropTypes.func.isRequired,
  queryProperties: ImmutablePropTypes.map.isRequired
};

const mapDispatchToProps = {
  addPropertyToQueryAction: addPropertyToQuery
};

const mapStateToProps = state => ({
  queryProperties: getQueryProperties(state)
});

export default connect(mapStateToProps, mapDispatchToProps)(PropertySelector);
