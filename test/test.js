/* eslint import/no-extraneous-dependencies: 0 */
require('@babel/register')({
  presets: ['react-app']
});

require('./test_apiMiddleware');
require('./test_stylesheetSelectors');
require('./test_stylesheetReducer');
require('./test_ProgressButton.js');
