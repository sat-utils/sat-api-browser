import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import FormLabel from '@material-ui/core/FormLabel';
import WrappedTextField from './WrappedTextField';
import { getQueryProperties } from '../reducers/filterSelectors';
import { removePropertyFromQuery } from '../actions/filterActions';
import { query } from '../constants/applicationConstants';
import RangeSlider from './RangeSlider';

const styles = theme => ({
  wrapper: {
    padding: '16px',
    paddingTop: 0,
    background: '#F8F8F8',
    marginTop: theme.spacing.unit * 2
  },
  labelWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginRight: -(theme.spacing.unit * 2)
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

  if (!queryProperties.size) return null;

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
        style={{
          marginBottom: '24px'
        }}
      >
        <div className={classes.labelWrapper}>
          <FormLabel component="label" style={{ flexGrow: 1, }}>
            {title}
          </FormLabel>
          <IconButton
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
        {valueControl}
      </div>
    );
  });

  return (
    <div className={classes.wrapper}>
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
