import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ContextMenuLayer } from "react-contextmenu";
import * as appStrings from '../../constants/appStrings';
import MapContainer2D from './MapContainer2D';
import MapContainer3D from './MapContainer3D';

export class MapContainer extends Component {

    render() {
        return (
            <div id="mapContainer">
                <MapContainer2D />
                <MapContainer3D />
            </div>
        );
    }
}

export default ContextMenuLayer(appStrings.MAP_CONTEXT_MENU, (data) => data)(connect()(MapContainer));
