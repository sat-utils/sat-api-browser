/* eslint no-underscore-dangle: "off" */
import test from 'tape';
import sinon from 'sinon';

const proxyquire = require('proxyquire').noCallThru();

const testAction = {
  type: 'CALL_API',
  payload: {
    endpoint: '',
    types: {
      requestType: 'FETCH',
      successType: 'FETCH_SUCCEEDED',
      errorType: 'FETCH_FAILED'
    },
    method: 'POST',
    json: 'filter'
  }
};

const setup = () => {
  const fetchWrapperStub = sinon.stub().resolves(true);
  const apiMiddleware = proxyquire(
    '../src/store/apiMiddleware',
    { '../utils/fetchWrapper': fetchWrapperStub }
  ).default;
  const store = { dispatch: () => false };
  const dispatch = sinon.stub(store, 'dispatch');
  const nextSpy = sinon.spy();
  return {
    fetchWrapperStub,
    store,
    dispatch,
    nextSpy,
    apiMiddleware
  };
};

test('apiMiddleware no op', (t) => {
  const action = { type: 'test' };
  const store = {};
  const next = sinon.spy();
  const { apiMiddleware } = setup();
  apiMiddleware(store)(next)(action);
  t.ok(
    next.withArgs(action).calledOnce,
    'Immediately returns next action when not CALL_API'
  );
  t.end();
});

test('apiMiddleware succesfull request', async (t) => {
  const {
    store,
    nextSpy,
  } = setup();

  const results = 'results';
  const response = { results };
  const fetchWrapperStub = sinon.stub().resolves(response);
  const apiMiddleware = proxyquire(
    '../src/store/apiMiddleware',
    { '../utils/fetchWrapper': fetchWrapperStub }
  ).default;

  await apiMiddleware(store)(nextSpy)(testAction);
  const { endpoint, method, json } = testAction.payload;
  t.ok(
    fetchWrapperStub.calledWithExactly(endpoint, method, json),
    'Calls the fetchWrapper function with proper arguments'
  );
  t.equal(
    nextSpy.firstCall.args[0].payload.json.results, results,
    'Calls next function with fetchWrapped response when succesfull'
  );
  t.equal(
    nextSpy.firstCall.args[0].payload.filter, 'filter',
    'Calls next function with original filter when succesfull'
  );
  t.equal(
    nextSpy.firstCall.args[0].type,
    testAction.payload.types.successType,
    'Calls next function with success action type when succesfull'
  );
  t.end();
});

test('apiMiddleware rejected request', async (t) => {
  const {
    store,
    nextSpy
  } = setup();

  const reject = { message: 'reject' };
  const fetchWrapperStub = sinon.stub().rejects(reject);
  const apiMiddleware = proxyquire(
    '../src/store/apiMiddleware',
    { '../utils/fetchWrapper': fetchWrapperStub }
  ).default;

  await apiMiddleware(store)(nextSpy)(testAction);
  t.equal(nextSpy.firstCall.args[0].error, reject.message);
  t.equal(nextSpy.firstCall.args[0].type, testAction.payload.types.errorType);
  t.end();
});
