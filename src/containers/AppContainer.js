import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/AppActions';
import * as layerActions from '../actions/LayerActions';
import MapContainer from './MapContainer';
import MapContainer3D from './MapContainer3D';
import SettingsContainer from './SettingsContainer';
import LoadingContainer from './LoadingContainer';
import HelpContainer from './HelpContainer';
import AlertsContainer from './AlertsContainer';
// import DateSliderContainer from './DateSlider';
import MapControlsContainer from './MapControlsContainer';
import TitleContainer from './TitleContainer';
import LayerMenuContainer from './LayerMenuContainer';
import '../styles/styles.scss';

export class AppContainer extends Component {
    componentDidMount() {
        this.props.actions.fetchInitialData(() => {
            this.props.actions.activateDefaultLayers();
            this.props.actions.initialLoad();
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
            initialLoad: bindActionCreators(actions.initialLoad, dispatch),
            fetchInitialData: bindActionCreators(layerActions.fetchInitialData, dispatch),
            activateDefaultLayers: bindActionCreators(layerActions.activateDefaultLayers, dispatch)
        }
    };
}

export default connect(
    null,
    mapDispatchToProps
)(AppContainer);
