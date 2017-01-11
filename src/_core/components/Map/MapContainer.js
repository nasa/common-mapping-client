import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { ContextMenuLayer } from "react-contextmenu";
import { bindActionCreators } from 'redux';
import * as appStrings from '_core/constants/appStrings';
import * as actions from '_core/actions/MapActions';
import MapContainer2D from '_core/components/Map/MapContainer2D';
import MapContainer3D from '_core/components/Map/MapContainer3D';

export class MapContainer extends Component {
	componentDidMount() {
		this.refs.container.addEventListener("mouseout", (evt) => {
			this.props.actions.invalidatePixelHover();
		});
	}

    render() {
        return (
            <div id="mapContainer" ref="container">
                <MapContainer2D />
                <MapContainer3D />
            </div>
        );
    }
}

MapContainer.propTypes = {
    actions: PropTypes.object.isRequired
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

export default ContextMenuLayer(appStrings.MAP_CONTEXT_MENU_ID, (data) => data)(connect(null, mapDispatchToProps)(MapContainer));
