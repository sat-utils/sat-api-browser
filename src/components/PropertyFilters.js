import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import WrappedTextField from './WrappedTextField';
import { getQueryProperties } from '../reducers/filterSelectors';
import { removePropertyFromQuery } from '../actions/filterActions';
import { query } from '../constants/applicationConstants';
import RangeSlider from './RangeSlider';

const styles = theme => ({
  elements: {
    margin: theme.spacing.unit
  }
});

const PropertyFilters = (props) => {
  const {
    queryProperties,
    values,
    classes,
    remove,
    setFieldValue,
    ...formikFieldProps
  } = props;
  const propertyFilters = queryProperties.entrySeq().map(([key, value]) => {
    const title = value.get('title');
    const type = value.get('type');
    const min = value.get('minimum');
    const max = value.get('maximum');
    const name = `${query}.${key}`;
    let valueControl;
    if (type === 'number') {
      valueControl = (
        <RangeSlider
          name={name}
          min={min}
          max={max}
          values={values}
          setFieldValue={setFieldValue}
          {...formikFieldProps}
        />
      );
    } else {
      valueControl = (
        <WrappedTextField
          name={name}
          label={title}
          type={type}
          values={values}
          className={classes.elements}
          setFieldValue={setFieldValue}
          {...formikFieldProps}
        />
      );
    }
    return (
      <div
        key={key}
        style={{ display: 'flex', alignItems: 'center', paddingTop: '15px' }}
      >
        <Chip
          label={title}
          className={classes.elements}
        />
        {valueControl}
        <IconButton
          className={classes.elements}
          onClick={() => {
            // This remove the property from Redux and the value from the form
            // values.
            remove(key);
            const newQuery = Object.assign({}, values.query);
            delete newQuery[key];
            setFieldValue(query, newQuery);
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </div>
    );
  });

  return (
    <div>
      {propertyFilters}
    </div>
  );
};

PropertyFilters.propTypes = {
  queryProperties: ImmutablePropTypes.map.isRequired,
  classes: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
  remove: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  queryProperties: getQueryProperties(state)
});

const mapDispatchToProps = {
  remove: removePropertyFromQuery
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(PropertyFilters));
