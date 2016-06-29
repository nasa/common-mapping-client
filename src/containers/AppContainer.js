import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/AppActions';
import * as layerActions from '../actions/LayerActions';
import MiscUtil from '../utils/MiscUtil';
import MapContainer from './Map/MapContainer';
import MapContainer3D from './Map/MapContainer3D';
import MapControlsContainer from './Map/MapControlsContainer';
import SettingsContainer from './Settings/SettingsContainer';
import ShareContainer from './Share/ShareContainer';
import LayerInfoContainer from './LayerInfo/LayerInfoContainer';
import LoadingContainer from './Loading/LoadingContainer';
import HelpContainer from './Help/HelpContainer';
import AlertsContainer from './Alerts/AlertsContainer';
import DateSliderContainer from './DateSlider/DateSliderContainer';
import TitleContainer from './Title/TitleContainer';
import LayerMenuContainer from './LayerMenu/LayerMenuContainer';
import '../styles/styles.scss';

export class AppContainer extends Component {
    componentDidMount() {
        this.props.actions.fetchInitialData(() => {
            let urlParams = MiscUtil.getUrlParams();
            if(urlParams.length === 0) {
                this.props.actions.activateDefaultLayers();
            } else {
                this.props.actions.runUrlConfig(urlParams);
            }
            this.props.actions.completeInitialLoad();
        });
    }

    render() {
        return (
            <div id="appContainer">
                <HelpContainer />
                <MapContainer />
                <MapContainer3D />
                <MapControlsContainer />
                <TitleContainer />
                <SettingsContainer />
                <ShareContainer />
                <LayerInfoContainer />
                <LayerMenuContainer />
                <DateSliderContainer />
                <AlertsContainer />
                <LoadingContainer />
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
            runUrlConfig: bindActionCreators(actions.runUrlConfig, dispatch)
        }
    };
}

export default connect(
    null,
    mapDispatchToProps
)(AppContainer);
