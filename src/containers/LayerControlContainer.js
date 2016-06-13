import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as layerActions from '../actions/LayerActions';
import ColorbarContainer from './ColorbarContainer';
import { IconButton } from 'react-toolbox/lib/button';
import Switch from 'react-toolbox/lib/switch';
import Slider from 'react-toolbox/lib/slider';

export class LayerControlContainer extends Component {
    changeOpacity(value) {
        let opacity = value / 100.00;
        this.props.actions.changeLayerOpacity(this.props.layer, opacity);
    }
    changePalette(){
        this.props.actions.changeLayerPalette(this.props.layer, {});
    }

    render() {
        return (
            <div>
                <div className="layer-control">
                    <div className="row middle-xs">
                        <span className="col-xs-11 layer-header text-wrap">{this.props.layer.get("title")}</span>
                    </div>
                    <div className="row middle-xs">
                        <div className="col-xs-2">
                            <Switch
                                className="layer-toggle"
                                checked={this.props.layer.get("isActive")}
                                onChange={() => this.props.actions.toggleLayer(this.props.layer)}
                            />
                        </div>
                        <div className="col-xs-9 text-center">
                            <ColorbarContainer palette={this.props.layer.get("palette")} />
                        </div>
                    </div>
                    <div className="row middle-xs">
                        <div className="col-xs-7 col-xs-offset-2 pos-rel">
                            <span className="slider-label">opacity</span>
                            <Slider pinned min={0} max={100} step={10} value={this.props.layer.get("opacity") * 100} className="layer-opacity-slider" onChange={(value) => this.changeOpacity(value)} />
                        </div>
                        <div className="col-xs-3 text-right">
                            <IconButton primary icon="vertical_align_center" className="no-padding rotate-90"/>
                            <IconButton primary icon="palette" className="no-padding" onMouseUp={() => this.changePalette()}/>
                        </div>
                    </div>
                </div>
                <hr className="divider" />
            </div>
        );
    }
}

LayerControlContainer.propTypes = {
    actions: PropTypes.object.isRequired,
    layer: PropTypes.object.isRequired
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(layerActions, dispatch)
    };
}

export default connect(
    null,
    mapDispatchToProps
)(LayerControlContainer);
