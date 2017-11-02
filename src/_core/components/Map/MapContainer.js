import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { ContextMenuTrigger } from "react-contextmenu";
import { bindActionCreators } from "redux";
import * as appStrings from "_core/constants/appStrings";
import * as actions from "_core/actions/MapActions";
import MapContainer2D from "_core/components/Map/MapContainer2D";
import MapContainer3D from "_core/components/Map/MapContainer3D";

export class MapContainer extends Component {
    componentDidMount() {
        this.refs.container.addEventListener("mouseout", evt => {
            this.props.actions.invalidatePixelHover();
        });
    }

    render() {
        return (
            <div id="mapContainer" ref="container">
                <ContextMenuTrigger id={appStrings.MAP_CONTEXT_MENU_ID} holdToDisplay={-1}>
                    <MapContainer2D />
                    <MapContainer3D />
                </ContextMenuTrigger>
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

export default connect(null, mapDispatchToProps)(MapContainer);
