import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactTooltip from 'react-tooltip';
import * as actions from '../../actions/AppActions';
import * as mapActions from '../../actions/MapActions';
import * as layerActions from '../../actions/LayerActions';
import * as mapStrings from '../../constants/mapStrings';
import MiscUtil from '../../utils/MiscUtil';
import MapContainer from '../Map/MapContainer';
import MapContextMenu from '../Map/MapContextMenu';
import MapControlsContainer from '../Map/MapControlsContainer';
import SettingsContainer from '../Settings/SettingsContainer';
import ShareContainer from '../Share/ShareContainer';
import LayerInfoContainer from '../LayerInfo/LayerInfoContainer';
import LoadingContainer from '../Loading/LoadingContainer';
import HelpContainer from '../Help/HelpContainer';
import AlertsContainer from '../Alerts/AlertsContainer';
import DateSliderContainer from '../DateSlider/DateSliderContainer';
import DatePickerContainer from '../DatePicker/DatePickerContainer';
import AppBarContainer from '../AppBar/AppBarContainer';
import LayerMenuContainer from '../LayerMenu/LayerMenuContainer';
import MouseFollowerContainer from '../MouseFollower/MouseFollowerContainer';
import AnalyticsContainer from '../Analytics/AnalyticsContainer';
// import '../../styles/styles.scss';

export class CoreAppContainer extends Component {
    componentWillMount() {
        // Setting urlParams as a local variable avoids setting application state before
        // we know if we want to set state via urlParams. If you set urlParams in state, 
        // you'd need to set app state to default and then check for urlParams and configure,
        // but that would change the urlParams, wiping out desired urlParams.

        // Generally speaking, however, it is not recommended to rely on instance variables inside of 
        // components since they lie outside of the application state and Redux paradigm.
        this.urlParams = MiscUtil.getUrlParams();
    }
    componentDidMount() {
        // disable the right click listener
        document.addEventListener("contextmenu", function(e) {
            e.preventDefault();
        }, false);

        // load in initial data
        this.props.actions.loadInitialData(() => {
            // initialize the map. I know this is hacky, but there simply doesn't seem to be a good way to
            // wait for the DOM to complete rendering.
            // see: http://stackoverflow.com/a/34999925
            window.requestAnimationFrame(() => {
                setTimeout(() => {
                    // initialize the maps
                    this.props.actions.initializeMap(mapStrings.MAP_LIB_2D, "map2D");
                    this.props.actions.initializeMap(mapStrings.MAP_LIB_3D, "map3D");

                    // activate default/url params
                    if (this.urlParams.length === 0) {
                        this.props.actions.activateDefaultLayers();
                    } else {
                        this.props.actions.runUrlConfig(this.urlParams);
                    }

                    // signal complete
                    this.props.actions.completeInitialLoad();
                }, 0);
            });
        });
    }

    render() {
        return (
            <div id="appContainer">
                <HelpContainer />
                <MapContainer />
                <MapControlsContainer />
                <AppBarContainer />
                <SettingsContainer />
                <ShareContainer />
                <LayerInfoContainer />
                <LayerMenuContainer />
                <DateSliderContainer />
                <DatePickerContainer />
                <AlertsContainer />
                <LoadingContainer />
                <MapContextMenu />
                <MouseFollowerContainer />
                <AnalyticsContainer />
                <ReactTooltip effect="solid" globalEventOff="click" delayShow={600} />
            </div>
        );
    }
}

CoreAppContainer.propTypes = {
    actions: PropTypes.object.isRequired
};

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            completeInitialLoad: bindActionCreators(actions.completeInitialLoad, dispatch),
            loadInitialData: bindActionCreators(layerActions.loadInitialData, dispatch),
            activateDefaultLayers: bindActionCreators(layerActions.activateDefaultLayers, dispatch),
            runUrlConfig: bindActionCreators(actions.runUrlConfig, dispatch),
            initializeMap: bindActionCreators(mapActions.initializeMap, dispatch)
        }
    };
}

export default connect(
    null,
    mapDispatchToProps
)(CoreAppContainer);
