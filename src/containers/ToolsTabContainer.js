import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as config from '../config/MainMenuConfig';
import * as actions from '../actions/MainMenuActions';
import MiscUtil from '../utils/MiscUtil';
import { List, ListItem } from 'react-toolbox/lib/list';
import MainMenuContentHeaderContainer from './MainMenuContentHeaderContainer';

export class ToolsTabContainer extends Component {
    render() {
        let toolsPanelClasses = MiscUtil.generateStringFromSet({
            "main-menu-panel": true,
            "active": this.props.selectedTab === config.TOOLS_LABEL
        });
        return (
            <div id="toolsTab" className={toolsPanelClasses}>
                <div className="menu-tab-wrapper">
                    <MainMenuContentHeaderContainer label={config.TOOLS_LABEL} />
                    <div className="menu-tab-content-wrapper">
                        <List className="no-margin" selectable ripple>
                            <ListItem
                                caption="Snapshot"
                                legend="Capture an image of the map"
                                leftIcon="photo"
                                rightIcon="keyboard_arrow_right"
                            />
                            <ListItem
                                caption="Animation"
                                legend="Run and export an animation"
                                leftIcon="videocam"
                                rightIcon="keyboard_arrow_right"
                            />
                            <ListItem
                                caption="Charting"
                                legend="Analyze a subset of data"
                                leftIcon="show_chart"
                                rightIcon="keyboard_arrow_right"
                            />
                        </List>
                    </div>
                </div>
            </div>
        );
    }
}

ToolsTabContainer.propTypes = {
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
)(ToolsTabContainer);
