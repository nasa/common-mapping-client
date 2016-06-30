import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Dialog from 'react-toolbox/lib/dialog';
// import { Button, IconButton } from 'react-toolbox/lib/button';
import { List, ListItem, ListSubHeader, ListCheckbox, ListDivider } from 'react-toolbox/lib/list';
import * as actions from '../../actions/AppActions';
import MiscUtil from '../../utils/MiscUtil';

export class LayerInfoContainer extends Component {
    render() {
        let metadata = this.props.layer.get("metadata");
        return (
            <Dialog className="layerInfo"
                active={this.props.isOpen}
                onEscKeyDown={() => this.props.actions.closeLayerInfo()} 
                onOverlayClick={() => this.props.actions.closeLayerInfo()}>
                <div className="thumbnail-image" style={{backgroundImage: "url("+this.props.layer.get("thumbnailImage")+")"}}></div>
                <div className="layerInfo-content">
                    <div className={metadata ? "" : "hidden"}>
                        <h2>{this.props.layer.get("title")}</h2>
                        <List className={"no-margin layerInfo-list"}>
                            <ListItem
                                caption={metadata ? metadata.get("platform") : ""}
                                leftIcon={(<i className="ms ms-satellite"></i>)}
                            />
                            <ListItem
                                caption={metadata ? metadata.get("spatialResolution") : ""}
                                leftIcon={(<i className="ms ms-merge"></i>)}
                            />
                            <ListItem
                                caption={metadata ? metadata.get("dateRange") : ""}
                                leftIcon="access_time"
                            />
                            <ListDivider />
                        </List>
                        <h3>Description</h3>
                        <p>{metadata ? metadata.get("description") : ""}</p>
                    </div>
                </div>
            </Dialog>
        );
    }
}

LayerInfoContainer.propTypes = {
    actions: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    layer: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        isOpen: state.layerInfo.get("isOpen"),
        layer: state.layerInfo.get("layer")
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
