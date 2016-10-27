import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from 'react-toolbox/lib/button';
import * as actions from '_core/actions/MapActions';
import * as appStrings from '_core/constants/appStrings';

export class MapControlsContainer extends Component {
    setViewMode() {
        if (this.props.in3DMode) {
            this.props.actions.setMapViewMode(appStrings.MAP_VIEW_MODE_2D);
        } else {
            this.props.actions.setMapViewMode(appStrings.MAP_VIEW_MODE_3D);
        }
    }

    render() {
        return (
            <div id="mapControls">
                <Button 
                    floating
                    neutral
                    label={this.props.in3DMode ? "2D" : "3D"} 
                    className="map-dimension-toggle mini-xs" 
                    onClick={() => this.setViewMode()} 
                    data-tip={this.props.in3DMode ? "Switch to 2D map" : "Switch to 3D map"} 
                    data-place="right"
                />
                <Button
                    floating
                    neutral
                    icon="navigation"
                    className={this.props.in3DMode ? "map-orientation-reset mini-xs" : "hidden"} 
                    onClick={() => {this.props.actions.resetOrientation(1);}}
                    data-tip="Reset orientation"
                    data-place="right" 
                />
                <Button
                    floating
                    neutral
                    icon="add"
                    className="map-zoom-in mini-xs" 
                    onClick={this.props.actions.zoomIn} 
                    data-tip="Zoom in"
                    data-place="right"
                />
                <Button
                    floating
                    neutral
                    icon="remove"
                    className="map-zoom-out mini-xs" 
                    onClick={this.props.actions.zoomOut} 
                    data-tip="Zoom out"
                    data-place="right"
                />
            </div>
        );
    }
}

MapControlsContainer.propTypes = {
    in3DMode: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        in3DMode: state.map.getIn(["view", "in3DMode"])
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MapControlsContainer);
