import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { ContextMenuLayer } from "react-contextmenu";
import { bindActionCreators } from 'redux';
import * as appStrings from '_core/constants/appStrings';
import * as actions from '_core/actions/MapActions';
import MapContainer2D from '_core/components/Map/MapContainer2D';
import MapContainer3D from '_core/components/Map/MapContainer3D';
import KeyHandler, { KEYUP } from 'react-key-handler';

export class MapContainer extends Component {
	componentDidMount() {
		this.refs.container.addEventListener("mouseout", (evt) => {
			this.props.actions.invalidatePixelHover();
		});
	}

    handleEscapeKeyPress() {
        if (this.props.isDrawingEnabled) {
            this.props.actions.disableDrawing();
        }
        if (this.props.isMeasuringEnabled) {
            this.props.actions.disableMeasuring();
        }
    }

    render() {
        return (
            <div id="mapContainer" ref="container">
                <MapContainer2D />
                <MapContainer3D />
                <KeyHandler keyEventName={KEYUP} keyValue="Escape" onKeyHandle={(evt) => this.handleEscapeKeyPress()} />
            </div>
        );
    }
}

MapContainer.propTypes = {
    isDrawingEnabled: PropTypes.bool.isRequired,
    isMeasuringEnabled: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        isDrawingEnabled: state.map.getIn(["drawing", "isDrawingEnabled"]),
        isMeasuringEnabled: state.map.getIn(["measuring", "isMeasuringEnabled"])
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

export default ContextMenuLayer(appStrings.MAP_CONTEXT_MENU_ID, (data) => data)(connect(mapStateToProps, mapDispatchToProps)(MapContainer));
