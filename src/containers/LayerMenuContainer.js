import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import LayerControlContainer from './LayerControlContainer';
import * as layerActions from '../actions/LayerActions';
import { Button, IconButton } from 'react-toolbox/lib/button';
import MiscUtil from '../utils/MiscUtil';
import Sortable from 'sortablejs';

export class LayerMenuContainer extends Component {
    componentDidMount() {
        let menuContent = document.getElementById('layerMenuContent');
    }
    render() {
        let layerList = this.props.layers.sort(MiscUtil.getImmutableObjectSort("title"));
        let totalNum = layerList.size;
        let activeNum = layerList.count((el) => { return el.get("isActive"); });

        // css classes
        let layerMenuClasses = MiscUtil.generateStringFromSet({
            "open": this.props.layerMenuOpen
        });

        return (
            <div id="layerMenu" className={layerMenuClasses}>
                <div id="layerHeaderRow" className="row middle-xs">
                    <div className="col-xs-8 text-left">
                        <span className="menu-header">Layer Controls</span>
                        <span className="note">({activeNum} of {totalNum} active)</span>
                    </div>
                    <div className="col-xs-4 text-right">
                        <IconButton
                            primary
                            icon={this.props.layerMenuOpen ? "keyboard_arrow_down" : "keyboard_arrow_up"}
                            className="no-padding mini-xs-waysmall"
                            onMouseUp={this.props.toggleLayerMenu}
                        />
                    </div>
                </div>
                <hr className="divider dark wide no-margin" />
                <div id="layerMenuContent">
                    {layerList.map((layer) =>
                        <LayerControlContainer
                            key={layer.get("id") + "_layer_listing"}
                            layer={layer}
                            palette={this.props.palettes.get(layer.getIn(["palette", "name"]))}
                        />
                    )}
                </div>
            </div>
        );
    }
}

LayerMenuContainer.propTypes = {
    toggleLayerMenu: PropTypes.func.isRequired,
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
        toggleLayerMenu: bindActionCreators(layerActions.toggleLayerMenu, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LayerMenuContainer);
