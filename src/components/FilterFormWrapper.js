import { connect } from 'react-redux';
import { withFormik } from 'formik';
import {
  isValid,
  isAfter,
  isEqual,
  subDays,
  parseISO,
  format
} from 'date-fns';
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
import {
  query as queryLiteral
} from '../constants/applicationConstants';

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
    const dateTimes = [];
    if (time) {
      const times = time.split('/');
      dateTimes[0] = parseISO(times[0]);
      dateTimes[1] = parseISO(times[1]);
    } else {
      dateTimes[0] = subDays(new Date(), 1);
      dateTimes[1] = new Date();
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

    const startDate = new Date(values.startdatetime);
    const endDate = new Date(values.enddatetime);
    const dateRangeErrorMessage = 'Start Date must be before End Date';
    if (isAfter(startDate, endDate)) {
      errors.startdatetime = dateRangeErrorMessage;
    }
    if (isEqual(startDate, endDate)) {
      errors.startdatetime = dateRangeErrorMessage;
    }
    const invalidDateMessage = 'Must be a valid date and time';
    if (!isValid(startDate)) {
      errors.startdatetime = invalidDateMessage;
    }
    if (!isValid(endDate)) {
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

    const formatStr = `yyyy-MM-dd'T'HH:mm`;
    const filter = {
      limit,
      bbox,
      query,
      time: `${format(startdatetime, formatStr)}/${format(enddatetime, formatStr)}`
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
