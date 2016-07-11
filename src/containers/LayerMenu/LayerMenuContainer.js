import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, IconButton } from 'react-toolbox/lib/button';
import LayerControlContainer from './LayerControlContainer';
import * as layerActions from '../../actions/LayerActions';
import MiscUtil from '../../utils/MiscUtil';
import { Scrollbars } from 'react-custom-scrollbars';

export class LayerMenuContainer extends Component {
    componentDidMount() {
        let menuContent = document.getElementById('layerMenuContent');
    }
    render() {
        let layerList = this.props.layers.sort(MiscUtil.getImmutableObjectSort("title"));
        let totalNum = layerList.size;
        let activeNum = layerList.count((el) => {
            return el.get("isActive");
        });

        // css classes
        let layerMenuClasses = MiscUtil.generateStringFromSet({
            "open": this.props.layerMenuOpen
        });

        let renderThumb = ({ style, ...props }) => {
            return (
                <div
                    style={{ ...style }}
                    className="scrollbar-thumb"
                    {...props}
                />
            );
        };

        return (
            <div id="layerMenu" className={layerMenuClasses}>
                <div id="layerHeaderRow" className="row middle-xs">
                    <div className="col-xs-8 text-left">
                        <span className="layer-menu-header">LAYER CONTROLS</span>
                        <span className="layer-menu-note"><span className="layer-menu-note-active">{activeNum}</span>/{totalNum}</span>
                    </div>
                    <div className="col-xs-4 text-right">
                        <IconButton
                            neutral
                            inverse
                            icon={this.props.layerMenuOpen ? "keyboard_arrow_down" : "keyboard_arrow_up"}
                            className="no-padding mini-xs-waysmall"
                            onMouseUp={() => this.props.setLayerMenuOpen(!this.props.layerMenuOpen)}
                        />
                    </div>
                </div>
                <div id="layerMenuContent">
                    <Scrollbars 
                        // style={{height:300}}
                        autoHeight
                        autoHeightMin={0}
                        autoHeightMax={300}
                        // autoHide={true}
                       renderThumbVertical={renderThumb}
                        renderTrackHorizontal={(style, ...props) =>
                            <div style={{display:"none"}}/>
                          }>
                        {layerList.map((layer) =>
                            <LayerControlContainer
                                key={layer.get("id") + "_layer_listing"}
                                layer={layer}
                                palette={this.props.palettes.get(layer.getIn(["palette", "name"]))}
                            />
                        )}
                    </Scrollbars>
                </div>
            </div>
        );
    }
}

LayerMenuContainer.propTypes = {
    setLayerMenuOpen: PropTypes.func.isRequired,
    layerMenuOpen: PropTypes.bool.isRequired,
    layers: PropTypes.object.isRequired,
    palettes: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        layerMenuOpen: state.view.get("layerMenuOpen"),
        layers: state.map.getIn(["layers", "data"]),
        palettes: state.map.get("palettes")
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setLayerMenuOpen: bindActionCreators(layerActions.setLayerMenuOpen, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LayerMenuContainer);
