/**
 * Copyright 2017 California Institute of Technology.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*eslint-disable import/default*/
import "@babel/polyfill";
import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import configureStore from "store/configureStore";
import { AppContainer } from "_core/components/App"; // Replace this with your own non-core version src/components/AppContainer/AppContainer.js
require("_core/styles/resources/img/apple-touch-icon.png");
require("_core/styles/resources/img/favicon-32x32.png");
require("_core/styles/resources/img/favicon-16x16.png");
require("_core/styles/resources/img/safari-pinned-tab.svg");
require("_core/styles/resources/img/favicon.ico");
require("_core/styles/resources/img/7994970.png");
require("_core/styles/resources/img/layer_thumbnails/AMSR2_Sea_Ice_Brightness_Temp_6km_89H.png");
require("_core/styles/resources/img/layer_thumbnails/GHRSST_L4_G1SST_Sea_Surface_Temperature.png");
require("_core/styles/resources/img/layer_thumbnails/MODIS_Terra_Brightness_Temp_Band31_Day.png");
require("_core/styles/resources/img/layer_thumbnails/VIIRS_SNPP_CorrectedReflectance_TrueColor.png");
require("_core/styles/resources/img/layer_thumbnails/flight_paths_kml.png");
require("_core/styles/resources/img/layer_thumbnails/us_state_outline_topojson.png");
require("_core/styles/resources/img/layer_thumbnails/ESRI_World_Imagery.jpeg");
require("_core/styles/resources/img/layer_thumbnails/BlueMarble_ShadedRelief_Bathymetry.jpeg");
require("_core/styles/resources/img/layer_thumbnails/OSM_Land_Water_Map.png");
require("_core/styles/resources/img/layer_thumbnails/ASTER_GDEM_Color_Shaded_Relief.jpeg");

const store = configureStore();

render(
    <Provider store={store}>
        <AppContainer />
    </Provider>,
    document.getElementById("app")
);
