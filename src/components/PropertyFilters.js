import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import WrappedTextField from './WrappedTextField';
import { getQueryProperties } from '../reducers/filterSelectors';
import { queryFilters } from '../constants/applicationConstants';
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
    ...formikFieldProps
  } = props;
  const propertyFilters = queryProperties.entrySeq().map(([key, value]) => {
    const title = value.get('title');
    const type = value.get('type');
    const min = value.get('minimum');
    const max = value.get('maximum');

    let valueControl;
    if (type === 'number') {
      valueControl = (
        <RangeSlider
          name={`${queryFilters}.${key}`}
          min={min}
          max={max}
          values={values}
          {...formikFieldProps}
        />
      );
    } else {
      valueControl = (
        <WrappedTextField
          name={`${queryFilters}.${key}`}
          label={title}
          type={type}
          values={values}
          className={classes.elements}
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
  values: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  queryProperties: getQueryProperties(state)
});

export default connect(mapStateToProps)(withStyles(styles)(PropertyFilters));
