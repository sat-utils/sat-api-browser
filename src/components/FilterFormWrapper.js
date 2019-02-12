import { connect } from 'react-redux';
import { withFormik } from 'formik';
import { fetchFilteredItems } from '../actions/filterActions';
import { startDrawing } from '../actions/stylesheetActionCreators';
import { getFilterStatus, getBbox, getQueryProperties }
  from '../reducers/filterSelectors';
import { getDrawing } from '../reducers/stylesheetSelectors';
import FilterForm from './FilterForm';

const limit = process.env.REACT_APP_RESULT_LIMIT;

export const FilterFormWrapper = withFormik({
  mapPropsToValues: () => {
    const initialValues = {
      startdatetime: new Date().toISOString().substring(0, 16),
      enddatetime: new Date().toISOString().substring(0, 16),
      queryFilters: {}
    };
    return initialValues;
  },

  validate: (values) => {
    const errors = {};
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
      queryFilters
    } = values;

    const query = Object.keys(queryFilters).reduce((accum, key) => {
      const filter = queryFilters[key];
      const { operator, value } = filter;
      // eslint-disable-next-line
      accum[key] = {
        [operator]: value
      };
      return accum;
    }, {});
    query.collection = {
      eq: 'landsat-8-l1'
    };
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
  queryProperties: getQueryProperties(state)
});

const mapDispatchToProps = {
  fetchFilteredItemsAction: fetchFilteredItems,
  startDrawingAction: startDrawing
};

export default connect(mapStateToProps, mapDispatchToProps)(FilterFormWrapper);