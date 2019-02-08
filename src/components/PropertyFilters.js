import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import FormikTextField from './FormikTextField';
import OperatorSelector from './OperatorSelector';
import { getQueryProperties } from '../reducers/querySelectors';

const styles = theme => ({
  elements: {
    margin: theme.spacing.unit
  }
});

const PropertyFilters = (props) => {
  const {
    queryProperties,
    // eslint-disable-next-line
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
          key={`${key}_label`}
          label={title}
          className={classes.elements}
        />
        <OperatorSelector
          name={`${key}_operator`}
          values={values}
          onlyEq={type === 'string'}
          className={classes.elements}
          {...formikFieldProps}
        />
        <FormikTextField
          name={`${key}_value`}
          label={type}
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
  queryProperties: ImmutablePropTypes.map.isRequired
};

const mapStateToProps = state => ({
  queryProperties: getQueryProperties(state)
});

export default connect(mapStateToProps)(withStyles(styles)(PropertyFilters));
