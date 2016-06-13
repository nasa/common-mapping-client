import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as config from '../config/MainMenuConfig';
import * as actions from '../actions/MainMenuActions';
import MiscUtil from '../utils/MiscUtil';
import MainMenuContentHeaderContainer from './MainMenuContentHeaderContainer';
import DatasetListingContainer from './DatasetListingContainer';

export class DatasetsTabContainer extends Component {
    render() {
        let toolsPanelClasses = MiscUtil.generateStringFromSet({
            "main-menu-panel": true,
            "active": this.props.selectedTab === config.DATASETS_LABEL
        });
        return (
            <div id="datasetsTab" className={toolsPanelClasses}>
                <div className="menu-tab-wrapper">
                    <MainMenuContentHeaderContainer label={config.DATASETS_LABEL} />
                    <div className="menu-tab-content-wrapper">
                        {this.props.layers.map((layer) =>
                            <DatasetListingContainer
                                key={layer.get("id") + "_dataset_listing"}
                                layer={layer}
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

DatasetsTabContainer.propTypes = {
    selectedTab: PropTypes.string.isRequired,
    layers: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        selectedTab: state.view.get("mainMenuTab"),
        layers: state.map.getIn(["layers", "data"])
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
)(DatasetsTabContainer);
