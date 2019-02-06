import React, { Fragment } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import FormikTextField from './FormikTextField';
import { getQueryProperties } from '../reducers/querySelectors';

const PropertyFilters = (props) => {
  const {
    queryProperties,
    // eslint-disable-next-line
    values,
    ...formikFieldProps
  } = props;
  const propertyFilters = queryProperties.entrySeq().map(([key, value]) => {
    const title = value.get('title');
    return (
      <FormikTextField
        key={key}
        name={key}
        label={title}
        values={values}
        {...formikFieldProps}
      />
    );
  });
  return (
    <Fragment>
      {propertyFilters}
    </Fragment>
  );
};

PropertyFilters.propTypes = {
  queryProperties: ImmutablePropTypes.map.isRequired
};

const mapStateToProps = state => ({
  queryProperties: getQueryProperties(state)
});

export default connect(mapStateToProps)(PropertyFilters);
