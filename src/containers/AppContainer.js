import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/AppActions';
import * as layerActions from '../actions/LayerActions';
import MapContainer from './Map/MapContainer';
import MapContainer3D from './Map/MapContainer3D';
import MapControlsContainer from './Map/MapControlsContainer';
import SettingsContainer from './Settings/SettingsContainer';
import LoadingContainer from './Loading/LoadingContainer';
import HelpContainer from './Help/HelpContainer';
import AlertsContainer from './Alerts/AlertsContainer';
// import DateSliderContainer from './DateSlider';
import TitleContainer from './Title/TitleContainer';
import LayerMenuContainer from './LayerMenu/LayerMenuContainer';
import '../styles/styles.scss';

export class AppContainer extends Component {
    componentDidMount() {
        this.props.actions.fetchInitialData(() => {
            this.props.actions.activateDefaultLayers();
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
                <LayerMenuContainer />
                {/*<DateSliderContainer />*/}
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
            activateDefaultLayers: bindActionCreators(layerActions.activateDefaultLayers, dispatch)
        }
    };
}

export default connect(
    null,
    mapDispatchToProps
)(AppContainer);
