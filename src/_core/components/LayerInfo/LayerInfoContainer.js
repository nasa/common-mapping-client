import Immutable from 'immutable';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Dialog from 'react-toolbox/lib/dialog';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import AsyncImageContainer from '_core/components/AsyncImage/AsyncImageContainer';
import { List, ListItem, ListDivider } from 'react-toolbox/lib/list';
import * as actions from '_core/actions/AppActions';
import MiscUtil from '_core/utils/MiscUtil';

const miscUtil = new MiscUtil();

const defaultData = Immutable.Map({
    title: "Title Unknown",
    platform: "Platform Unknown",
    spatialResolution: "Spatial Resolution Unknown",
    dateRange: "Date Range Unknown",
    description: "Description Unknown"
});
export class LayerInfoContainer extends Component {
    render() {
        let metadata = defaultData.merge(this.props.metadata.get("content"));

        let loadingClasses = miscUtil.generateStringFromSet({
            "layer-info-loading": true,
            "active": this.props.dataLoading
        });
        return (
            <Dialog
                className="layer-info"
                active={this.props.isOpen}
                onEscKeyDown={() => this.props.actions.closeLayerInfo()} 
                onOverlayClick={() => this.props.actions.closeLayerInfo()} >
                <AsyncImageContainer className="thumbnail-image" src={this.props.thumbnailUrl} />
                <div className="layer-info-content">
                    <div className={loadingClasses}>
                        <ProgressBar type="circular" mode="indeterminate" className="layer-info-spinner" />
                    </div>
                    <h2>{metadata.get("title")}</h2>
                    <List className="no-margin layer-info-list">
                        <ListItem
                            caption={metadata.get("platform")}
                            leftIcon={(<i className="ms ms-satellite" />)}
                        />
                        <ListItem
                            caption={metadata.get("spatialResolution")}
                            leftIcon={(<i className="ms ms-merge" />)}
                        />
                        <ListItem
                            caption={metadata.get("dateRange")}
                            leftIcon="access_time"
                        />
                        <ListDivider />
                    </List>
                    <h3>Description</h3>
                    <p>{metadata.get("description")}</p>
                </div>
            </Dialog>
        );
    }
}

LayerInfoContainer.propTypes = {
    actions: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    layerId: PropTypes.string.isRequired,
    thumbnailUrl: PropTypes.string.isRequired,
    metadata: PropTypes.object.isRequired,
    dataLoading: PropTypes.bool.isRequired,
    dataLoadingAttempted: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
    return {
        isOpen: state.layerInfo.get("isOpen"),
        layerId: state.layerInfo.get("activeLayerId"),
        thumbnailUrl: state.layerInfo.get("activeThumbnailUrl"),
        metadata: state.layerInfo.get("metadata"),
        dataLoading: state.asynchronous.get("loadingLayerMetadata"),
        dataLoadingAttempted: state.asynchronous.get("loadingMetadataAttempted")
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
)(LayerInfoContainer);
