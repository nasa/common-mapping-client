/*eslint-disable import/default*/
import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import AppContainer from './components/App/AppContainer';
require('./styles/resources/img/favicon.ico');
require('./styles/resources/img/7994970.png');
// require('./styles/lib/mapskin/css/mapskin.min.css');

const store = configureStore();

render(
    <Provider store={store}>
        <AppContainer />
    </Provider>,
    document.getElementById('app')
);
