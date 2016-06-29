import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Dialog from 'react-toolbox/lib/dialog';
// import { Button, IconButton } from 'react-toolbox/lib/button';
// import { List, ListItem, ListSubHeader, ListCheckbox, ListDivider } from 'react-toolbox/lib/list';
import * as actions from '../../actions/AppActions';
import MiscUtil from '../../utils/MiscUtil';

export class LayerInfoContainer extends Component {
    render() {
        return (
            <Dialog className="layerInfo"
                active={this.props.isOpen}
                onEscKeyDown={() => this.props.actions.closeLayerInfo()} 
                onOverlayClick={() => this.props.actions.closeLayerInfo()}>
                <div className="thumbnail-image" style={{backgroundImage: "url("+this.props.layer.get("thumbnailImage")+")"}}></div>
                <div className="layer-info-content">
                    <h2>{this.props.layer.get("title")}</h2>
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
