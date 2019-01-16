import { CALL_API } from '../constants/action_types';
import fetchWrapper from '../utils/fetchWrapper';

const apiMiddleware = store => next => async (action) => {
  if (action.type !== CALL_API) {
    return next(action);
  }
  const {
    endpoint,
    types,
    method,
    json
  } = action.payload;

  const { requestType, successType, errorType } = types;
  store.dispatch({ type: requestType });
  try {
    const responseJSON = await fetchWrapper(endpoint, method, json)
      .catch(error => (
        next({
          error: error.message || 'There was an error.',
          type: errorType
        })
      ));
    return next({
      payload: {
        json: responseJSON,
      },
      type: successType
    });
  } catch (error) {
    return next({
      error: error.message || 'There was an error.',
      type: errorType
    });
  }
};

export default apiMiddleware;
