/* eslint import/no-extraneous-dependencies: 0 */
require('@babel/register')({
  presets: ['react-app']
});

global.fetch = () => {};

require('./test_stylesheetSelectors');
require('./test_stylesheetReducer');
require('./test_ProgressButton.js');
require('./test_FilterFormWrapper.js');
require('./test_ResultsPaging.js');
require('./test_ImageItem.js');
