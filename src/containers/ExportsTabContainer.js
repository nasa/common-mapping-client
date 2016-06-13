import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as config from '../config/MainMenuConfig';
import * as actions from '../actions/MainMenuActions';
import MiscUtil from '../utils/MiscUtil';
import MainMenuContentHeaderContainer from './MainMenuContentHeaderContainer';

export class ExportsTabContainer extends Component {
    render() {
        let toolsPanelClasses = MiscUtil.generateStringFromSet({
            "main-menu-panel": true,
            "active": this.props.selectedTab === config.EXPORTS_LABEL
        });
        return (
            <div id="exportsTab" className={toolsPanelClasses}>
                <div className="menu-tab-wrapper">
                    <MainMenuContentHeaderContainer label={config.EXPORTS_LABEL} />
                    <div className="menu-tab-content-wrapper">
                        <h3>Export 1</h3>
                        <h3>Export 2</h3>
                        <h3>Export 3</h3>
                        <h3>Export 4</h3>
                    </div>
                </div>
            </div>
        );
    }
}

ExportsTabContainer.propTypes = {
    selectedTab: PropTypes.string.isRequired,
    actions: PropTypes.object.isRequired
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
)(ExportsTabContainer);
