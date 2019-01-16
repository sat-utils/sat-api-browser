import React from 'react';
import 'typeface-roboto'; // eslint-disable-line
import { Provider } from 'react-redux';
import createStore from './store/store';
import Container from './components/Container';

const store = createStore;
// eslint-disable-next-line
window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

const App = () => (
  <Provider store={store}>
    <Container />
  </Provider>
);

export default App;
