import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as config from '../config/MainMenuConfig';
import * as actions from '../actions/MainMenuActions';
import MiscUtil from '../utils/MiscUtil';
import DatasetsTabContainer from './DatasetsTabContainer';
import ToolsTabContainer from './ToolsTabContainer';
import ExportsTabContainer from './ExportsTabContainer';
import SettingsTabContainer from './SettingsTabContainer';

export class MainMenuContentContainer extends Component {
    render() {
        return (
            <div id="mainMenuContent">
                <DatasetsTabContainer />
                <ToolsTabContainer />
                <ExportsTabContainer />
                <SettingsTabContainer />
            </div>
        );
    }
}

MainMenuContentContainer.propTypes = {
    actions: PropTypes.object.isRequired,
    selectedTab: PropTypes.string.isRequired
};

function mapStateToProps(state) {
    return {
        selectedTab: state.view.get("mainMenuTab")
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
)(MainMenuContentContainer);
