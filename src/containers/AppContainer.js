import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactTooltip from 'react-tooltip';
import * as actions from '../actions/AppActions';
import * as mapActions from '../actions/MapActions';
import * as layerActions from '../actions/LayerActions';
import * as mapStrings from '../constants/mapStrings';
import MiscUtil from '../utils/MiscUtil';
import MapContainer from './Map/MapContainer';
import MapContextMenu from './Map/MapContextMenu';
import MapControlsContainer from './Map/MapControlsContainer';
import SettingsContainer from './Settings/SettingsContainer';
import ShareContainer from './Share/ShareContainer';
import LayerInfoContainer from './LayerInfo/LayerInfoContainer';
import LoadingContainer from './Loading/LoadingContainer';
import HelpContainer from './Help/HelpContainer';
import AlertsContainer from './Alerts/AlertsContainer';
import DateSliderContainer from './DateSlider/DateSliderContainer';
import DatePickerContainer from './DatePicker/DatePickerContainer';
import AppBarContainer from './AppBar/AppBarContainer';
import ToolsContainer from './Tools/ToolsContainer';
import LayerMenuContainer from './LayerMenu/LayerMenuContainer';
import '../styles/styles.scss';

export class AppContainer extends Component {
    componentWillMount() {
        // Don't do this!
        this.urlParams = MiscUtil.getUrlParams();
    }
    componentDidMount() {
        this.props.actions.fetchInitialData(() => {
            //initialize the map. I know this is hacky, but there simply doesn't seem to be a good way to
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
                <ToolsContainer />
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
                <ReactTooltip effect="solid" globalEventOff="click" delayShow={750} />
            </div>
        );
    }
}

AppContainer.propTypes = {
    actions: PropTypes.object.isRequired
};

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            completeInitialLoad: bindActionCreators(actions.completeInitialLoad, dispatch),
            fetchInitialData: bindActionCreators(layerActions.fetchInitialData, dispatch),
            activateDefaultLayers: bindActionCreators(layerActions.activateDefaultLayers, dispatch),
            runUrlConfig: bindActionCreators(actions.runUrlConfig, dispatch),
            initializeMap: bindActionCreators(mapActions.initializeMap, dispatch)
        }
    };
}

export default connect(
    null,
    mapDispatchToProps
)(AppContainer);
