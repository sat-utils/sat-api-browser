import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import WrappedTextField from './WrappedTextField';
import OperatorSelector from './OperatorSelector';
import { getQueryProperties } from '../reducers/filterSelectors';
import { queryFilters } from '../constants/applicationConstants';

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

    return (
      <div key={key}>
        <Chip
          label={title}
          className={classes.elements}
        />
        <OperatorSelector
          name={`${queryFilters}.${key}.operator`}
          values={values}
          onlyEq={type === 'string'}
          className={classes.elements}
          {...formikFieldProps}
        />
        <WrappedTextField
          name={`${queryFilters}.${key}.value`}
          type={type}
          values={values}
          className={classes.elements}
          {...formikFieldProps}
        />
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
