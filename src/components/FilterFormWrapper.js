import { connect } from 'react-redux';
import { withFormik } from 'formik';
import { fetchFilteredItems } from '../actions/filterActions';
import { startDrawing } from '../actions/stylesheetActionCreators';
import {
  getFilterStatus,
  getBbox,
  getQueryProperties,
  getCurrentFilter
} from '../reducers/filterSelectors';
import { getDrawing } from '../reducers/stylesheetSelectors';
import FilterForm from './FilterForm';
import { query as queryLiteral }
  from '../constants/applicationConstants';

const limit = process.env.REACT_APP_RESULT_LIMIT;

function addFilterError(key, errors, message) {
  const newErrors = Object.assign({}, errors);
  newErrors[queryLiteral] = Object.assign({}, errors[queryLiteral], {
    [key]: message
  });
  return newErrors;
}

export const FilterFormWrapper = withFormik({
  mapPropsToValues: (props) => {
    const currentFilter = props.currentFilter.toJS();
    const { query, time } = currentFilter;
    let dateTimes = [];
    if (time) {
      const times = time.split('/');
      dateTimes = times;
    } else {
      dateTimes[0] = new Date().toISOString().substring(0, 16);
      dateTimes[1] = new Date().toISOString().substring(0, 16);
    }
    const initialValues = {
      query: query || {},
      startdatetime: dateTimes[0],
      enddatetime: dateTimes[1]
    };
    return initialValues;
  },

  validate: (values, props) => {
    const { queryProperties } = props;
    const { query } = values;
    const errors = Object.keys(query).reduce((accum, key) => {
      let errorAccum = Object.assign({}, accum);
      const type = queryProperties.getIn([key, 'type']);
      const filter = query[key];
      if (type === 'string') {
        if (!(filter.eq && filter.eq.length)) {
          errorAccum = addFilterError(key, accum, 'Must be a string');
        }
      }
      if (type === 'number') {
        const minimum = queryProperties.getIn([key, 'minimum']);
        const maximum = queryProperties.getIn([key, 'maximum']);
        if (minimum !== null && maximum !== null) {
          const valid = (filter.gte >= minimum && filter.lte <= maximum);
          if (!valid) {
            errorAccum = addFilterError(key, accum,
              `Must be between ${minimum} and ${maximum}`);
          }
        }
      }
      return errorAccum;
    }, {});

    if (values.startdatetime >= values.enddatetime) {
      errors.startdatetime = 'Start Date must be before End Date';
    }
    const dateRegex = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9])?$/;
    const invalidDateMessage = 'Must be a valid date and time';
    const startValid = dateRegex.test(values.startdatetime);
    if (!startValid) {
      errors.startdatetime = invalidDateMessage;
    }
    const endValid = dateRegex.test(values.enddatetime);
    if (!endValid) {
      errors.enddatetime = invalidDateMessage;
    }

    return errors;
  },

  handleSubmit: (values, { props, setSubmitting }) => {
    const {
      fetchFilteredItemsAction,
      bbox
    } = props;

    const {
      startdatetime,
      enddatetime,
      query
    } = values;

    const filter = {
      limit,
      bbox,
      query,
      time: `${startdatetime}/${enddatetime}`
    };
    fetchFilteredItemsAction(filter);
    setSubmitting(false);
  }
})(FilterForm);

const mapStateToProps = state => ({
  status: getFilterStatus(state),
  bbox: getBbox(state),
  drawing: getDrawing(state),
  queryProperties: getQueryProperties(state),
  currentFilter: getCurrentFilter(state)
});

const mapDispatchToProps = {
  fetchFilteredItemsAction: fetchFilteredItems,
  startDrawingAction: startDrawing
};

export default connect(mapStateToProps, mapDispatchToProps)(FilterFormWrapper);
