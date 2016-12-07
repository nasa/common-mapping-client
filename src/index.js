/*eslint-disable import/default*/
import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from 'store/configureStore';
import MyAppContainer from 'components/App/AppContainer';
require('_core/styles/resources/img/apple-touch-icon.png');
require('_core/styles/resources/img/favicon-32x32.png');
require('_core/styles/resources/img/favicon-16x16.png');
require('_core/styles/resources/img/safari-pinned-tab.svg');
require('_core/styles/resources/img/favicon.ico');
require('_core/styles/resources/img/7994970.png');

const store = configureStore();

render(
    <Provider store={store}>
        <MyAppContainer />
    </Provider>,
    document.getElementById('app')
);
