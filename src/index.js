/*eslint-disable import/default*/
import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from 'store/configureStore';
import AppContainer from '_core/components/App/AppContainer'; // Replace this with your own non-core version src/components/AppContainer/AppContainer.js
require('_core/styles/resources/img/apple-touch-icon.png');
require('_core/styles/resources/img/favicon-32x32.png');
require('_core/styles/resources/img/favicon-16x16.png');
require('_core/styles/resources/img/safari-pinned-tab.svg');
require('_core/styles/resources/img/favicon.ico');
require('_core/styles/resources/img/7994970.png');
require('_core/styles/resources/img/layer_thumbnails/AMSR2_Sea_Ice_Brightness_Temp_6km_89H.png');
require('_core/styles/resources/img/layer_thumbnails/GHRSST_L4_G1SST_Sea_Surface_Temperature.png');
require('_core/styles/resources/img/layer_thumbnails/MODIS_Terra_Brightness_Temp_Band31_Day.png');
require('_core/styles/resources/img/layer_thumbnails/VIIRS_SNPP_CorrectedReflectance_TrueColor.png');
require('_core/styles/resources/img/layer_thumbnails/flight_paths_kml.png');
require('_core/styles/resources/img/layer_thumbnails/us_state_outline_topojson.png');

const store = configureStore();

render(
    <Provider store={store}>
        <AppContainer /> 
    </Provider>,
    document.getElementById('app')
);
