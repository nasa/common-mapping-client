import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from 'react-toolbox/lib/button';
import * as actions from '_core/actions/MapActions';
import * as appActions from '_core/actions/AppActions';
import * as appStrings from '_core/constants/appStrings';
import * as appConfig from 'constants/appConfig';
import MiscUtil from '_core/utils/MiscUtil';

const miscUtil = new MiscUtil();

const EyeIcon = () => (
    <svg className="material-icons" data-react-toolbox="font-icon" viewBox="0 0 24 24" style={{height: "100%"}}>
        <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" /> 
    </svg>
);
const EyeOffIcon = () => (
    <svg className="material-icons" data-react-toolbox="font-icon" viewBox="0 0 24 24" style={{height: "100%"}}>
        <path d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.08L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.74,7.13 11.35,7 12,7Z" /> 
    </svg>
);

export class MapControlsContainer extends Component {
    componentDidMount() {
        this.hideMapControlsTimeout = null;
        this.mouseMovementTimeThreshold = 2000;
        this.hideMapControlsEnabled = false;
        this._isInDistractionFreeMode = false;
    }
    componentWillUpdate(nextProps, nextState) {
        // If we're not going to be in distractionFreeMode we can stop everything
        if (!nextProps.distractionFreeMode) {
            this.stopListeningToMouseMovement();
            this._isInDistractionFreeMode = false;
        }
        // If we are transitioning to distractionFreeMode
        else if (!this.props.distractionFreeMode && nextProps.distractionFreeMode) {
            // this.startListeningToMouseMovement();
            this._isInDistractionFreeMode = true;
        }
    }
    startListeningToMouseMovement() {
        this.hideMapControlsTimeout = setTimeout(() => {this.hideMapControls()}, this.mouseMovementTimeThreshold);
        window.onmousemove = () => {
            // Clear the timeout
            clearTimeout(this.hideMapControlsTimeout);
            this.hideMapControlsEnabled = false;
            this.startListeningToMouseMovement();
            this.props.appActions.hideMapControls(false);
        } 
    }
    stopListeningToMouseMovement() {
        clearTimeout(this.hideMapControlsTimeout);
        this.hideMapControlsEnabled = false;
        window.onmousemove = null;
        this.props.appActions.hideMapControls(false);
    }
    hideMapControls() {
        if (!this.hideMapControlsEnabled) {
            this.hideMapControlsEnabled = true;
            this.props.appActions.hideMapControls(true);
        }
    }
    onMapControlsMouseEnter() {
        if (this.props.distractionFreeMode) {
            this.stopListeningToMouseMovement();
        }
    }
    onMapControlsMouseLeave() {
        if (this.props.distractionFreeMode) {
            this.startListeningToMouseMovement();
        }
    }
    setViewMode() {
        if (this.props.in3DMode) {
            this.props.actions.setMapViewMode(appStrings.MAP_VIEW_MODE_2D);
        } else {
            this.props.actions.setMapViewMode(appStrings.MAP_VIEW_MODE_3D);
        }
    }

    render() {
        let containerClasses = miscUtil.generateStringFromSet({
            "hidden-fade-out": this.props.mapControlsHidden && this.props.distractionFreeMode,
            "hidden-fade-in": !this.props.mapControlsHidden && this.props.distractionFreeMode
        });
        return (
            <div className={containerClasses} id="mapControls" 
                onMouseLeave={() => {this.onMapControlsMouseLeave()}}
                onMouseEnter={() => {this.onMapControlsMouseEnter()}}
                >
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
                    className={"map-distraction-free-mode mini-xs"} 
                    onClick={() => {this.props.appActions.setDistractionFreeMode(!this.props.distractionFreeMode)}}
                    data-tip={this.props.distractionFreeMode ? "Disable distraction free mode" : "Enable distraction free mode"} 
                    data-place="right" 
                >{this.props.distractionFreeMode ? (<EyeIcon/>) : (<EyeOffIcon/>)}</Button>
                <Button
                    floating
                    neutral
                    icon="home"
                    className={"map-reset-view mini-xs"} 
                    onClick={() => {
                        this.props.actions.setMapView({extent: appConfig.DEFAULT_PROJECTION.extent});
                    }}
                    data-tip="Reset Map View"
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
    distractionFreeMode: PropTypes.bool.isRequired,
    mapControlsHidden: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired,
    appActions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        in3DMode: state.map.getIn(["view", "in3DMode"]),
        distractionFreeMode: state.view.get("distractionFreeMode"),
        mapControlsHidden: state.view.get("mapControlsHidden")
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        appActions: bindActionCreators(appActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MapControlsContainer);
