import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ReactTooltip from "react-tooltip";
import * as actions from "_core/actions/AppActions";
import * as mapActions from "_core/actions/MapActions";
import * as layerActions from "_core/actions/LayerActions";
import * as appStrings from "_core/constants/appStrings";
import appConfig from "constants/appConfig";
import MiscUtil from "_core/utils/MiscUtil";
import MapContainer from "_core/components/Map/MapContainer";
import MapContextMenu from "_core/components/Map/MapContextMenu";
import MapControlsContainer from "_core/components/Map/MapControlsContainer";
import SettingsContainer from "_core/components/Settings/SettingsContainer";
import ShareContainer from "_core/components/Share/ShareContainer";
import LayerInfoContainer from "_core/components/LayerInfo/LayerInfoContainer";
import LoadingContainer from "_core/components/Loading/LoadingContainer";
import HelpContainer from "_core/components/Help/HelpContainer";
import AlertsContainer from "_core/components/Alerts/AlertsContainer";
import DateSliderContainer from "_core/components/DateSlider/DateSliderContainer";
import DatePickerContainer from "_core/components/DatePicker/DatePickerContainer";
import AppBarContainer from "_core/components/AppBar/AppBarContainer";
import LayerMenuContainer from "_core/components/LayerMenu/LayerMenuContainer";
import MouseFollowerContainer from "_core/components/MouseFollower/MouseFollowerContainer";
import AnalyticsContainer from "_core/components/Analytics/AnalyticsContainer";
import KeyboardControlsContainer from "_core/components/KeyboardControls/KeyboardControlsContainer";
import CoordinateTracker from "_core/components/Map/CoordinateTracker";
import "styles/styles.scss";

const miscUtil = new MiscUtil();

export class AppContainer extends Component {
    constructor(props) {
        super(props);

        // Setting urlParams as a local variable avoids setting application state before
        // we know if we want to set state via urlParams. If you set urlParams in state,
        // you'd need to set app state to default and then check for urlParams and configure,
        // but that would change the urlParams, wiping out desired urlParams.

        // Generally speaking, however, it is not recommended to rely on instance variables inside of
        // components since they lie outside of the application state and Redux paradigm.
        this.urlParams = miscUtil.getUrlParams();
    }

    componentDidMount() {
        // disable the right click listener
        document.addEventListener(
            "contextmenu",
            function(e) {
                e.preventDefault();
            },
            false
        );

        // Perform initial browser functionality check
        this.props.actions.checkBrowserFunctionalities();

        // load in initial data
        this.props.actions.loadInitialData(() => {
            // initialize the map. I know this is hacky, but there simply doesn't seem to be a good way to
            // wait for the DOM to complete rendering.
            // see: http://stackoverflow.com/a/34999925
            window.requestAnimationFrame(() => {
                setTimeout(() => {
                    // initialize the maps
                    this.props.actions.initializeMap(appStrings.MAP_LIB_2D, "map2D");
                    this.props.actions.initializeMap(appStrings.MAP_LIB_3D, "map3D");

                    // set initial view
                    this.props.actions.setMapView({ extent: appConfig.DEFAULT_BBOX_EXTENT }, true);

                    // activate default/url params
                    if (this.urlParams.length === 0) {
                        this.props.actions.activateDefaultLayers();
                    } else {
                        this.props.actions.runUrlConfig(this.urlParams);
                    }

                    // signal complete
                    this.props.actions.completeInitialLoad();

                    // ReactTooltip needs to be rebuilt to account
                    // for dynamic lists in LayerMenuContainer
                    ReactTooltip.rebuild();
                }, 0);
            });
        });
    }

    render() {
        let containerClasses = miscUtil.generateStringFromSet({
            "mouse-hidden": this.props.mapControlsHidden && this.props.distractionFreeMode,
            "mouse-shown": !this.props.mapControlsHidden && this.props.distractionFreeMode
        });
        return (
            <div id="appContainer" className={containerClasses}>
                <DatePickerContainer />
                <HelpContainer />
                <MapContainer />
                <MapControlsContainer />
                <AppBarContainer />
                <SettingsContainer />
                <ShareContainer />
                <LayerInfoContainer />
                <LayerMenuContainer />
                <DateSliderContainer />
                <AlertsContainer />
                <LoadingContainer />
                <MapContextMenu />
                <MouseFollowerContainer />
                <AnalyticsContainer />
                <KeyboardControlsContainer />
                <CoordinateTracker />
                <ReactTooltip effect="solid" globalEventOff="click" delayShow={600} />
            </div>
        );
    }
}

AppContainer.propTypes = {
    actions: PropTypes.object.isRequired,
    distractionFreeMode: PropTypes.bool.isRequired,
    mapControlsHidden: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
    return {
        distractionFreeMode: state.view.get("distractionFreeMode"),
        mapControlsHidden: state.view.get("mapControlsHidden")
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            completeInitialLoad: bindActionCreators(actions.completeInitialLoad, dispatch),
            checkBrowserFunctionalities: bindActionCreators(
                actions.checkBrowserFunctionalities,
                dispatch
            ),
            loadInitialData: bindActionCreators(layerActions.loadInitialData, dispatch),
            activateDefaultLayers: bindActionCreators(layerActions.activateDefaultLayers, dispatch),
            runUrlConfig: bindActionCreators(actions.runUrlConfig, dispatch),
            initializeMap: bindActionCreators(mapActions.initializeMap, dispatch),
            setMapView: bindActionCreators(mapActions.setMapView, dispatch)
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
