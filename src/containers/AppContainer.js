import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/AppActions';
import * as layerActions from '../actions/LayerActions';
import * as mapActions from '../actions/MapActions';
import MapContainer from './MapContainer';
import MapContainer3D from './MapContainer3D';
import SettingsContainer from './SettingsContainer';
import LoadingContainer from './LoadingContainer';
import HelpContainer from './HelpContainer';
import AlertsContainer from './AlertsContainer';
import DateSliderContainer from './DateSliderContainer';
import MapControlsContainer from './MapControlsContainer';
import TitleContainer from './TitleContainer';
import LayerMenuContainer from './LayerMenuContainer';
import '../styles/styles.scss';

export class AppContainer extends Component {
    componentDidMount() {
        this.props.actions.fetchLayers(() => {
            this.props.actions.activateDefaultLayers();
            setTimeout(() => {
                this.props.actions.initialLoad();
            }, 750);

            // TESTING OUT DATE CHANGES
            // let i = 1;
            // setInterval(() => {
            //     this.props.actions.setDate(new Date("2015-01-" + i));
            //     if(++i > 31) {
            //         i = 1;
            //     }
            // }, 5000);
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
            initialLoad: bindActionCreators(actions.initialLoad, dispatch),
            fetchLayers: bindActionCreators(layerActions.fetchLayers, dispatch),
            activateDefaultLayers: bindActionCreators(layerActions.activateDefaultLayers, dispatch),
            setDate: bindActionCreators(mapActions.setDate, dispatch)
        }
    };
}

export default connect(
    null,
    mapDispatchToProps
)(AppContainer);
