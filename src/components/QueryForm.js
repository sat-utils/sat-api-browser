import { connect } from 'react-redux';
import { withFormik } from 'formik';
import { fetchFilteredItems } from '../actions/queryActions';
import { startDrawing } from '../actions/stylesheetActionCreators';
import { getQueryStatus, getBbox } from '../reducers/querySelectors';
import { getDrawing } from '../reducers/stylesheetSelectors';
import InnerForm from './InnerForm';

const limit = process.env.REACT_APP_RESULT_LIMIT;

export const EnhancedForm = withFormik({
  mapPropsToValues: () => ({
    startdatetime: new Date().toISOString().substring(0, 16),
    enddatetime: new Date().toISOString().substring(0, 16),
  }),

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
      enddatetime
    } = values;

    const filter = {
      limit,
      bbox,
      time: `${startdatetime}/${enddatetime}`,
      query: {
        collection: {
          eq: 'landsat-8-l1'
        }
      }
    };
    fetchFilteredItemsAction(filter);
    setSubmitting(false);
  }
})(InnerForm);

const mapStateToProps = state => ({
  status: getQueryStatus(state),
  bbox: getBbox(state),
  drawing: getDrawing(state)
});

const mapDispatchToProps = {
  fetchFilteredItemsAction: fetchFilteredItems,
  startDrawingAction: startDrawing
};

export default connect(mapStateToProps, mapDispatchToProps)(EnhancedForm);
