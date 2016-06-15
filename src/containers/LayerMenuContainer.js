import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import LayerControlContainer from './LayerControlContainer';
import * as layerActions from '../actions/LayerActions';
import Button from 'react-toolbox/lib/button';
import MiscUtil from '../utils/MiscUtil';
import Sortable from 'sortablejs';

export class LayerMenuContainer extends Component {
    // <div id="layer-subheader-row" className="row middle-xs">
    //     <span className="col-xs-8 text-left menu-subheader">drag title to rearrange display order</span>
    //     <span className="col-xs-4 text-right menu-subheader">value at cursor</span>
    // </div>
    componentDidMount() {
        let menuContent = document.getElementById('layerMenuContent');
        Sortable.create(menuContent, {
            draggable: ".layer-control",
            handle: ".layer-header",
            animation: 150,
            onEnd: (evt) => {
                let newIndex = evt.newIndex;
                let listItem = evt.item;
            }
        });
    }
    render() {
        // let layerList = this.props.layers.sortBy((layer) => { layer.get("displayIndex"); });
        let layerList = this.props.layers.sort(MiscUtil.getImmutableObjectSort("title"));
        let totalNum = layerList.size;
        let activeNum = layerList.count((el) => { return el.get("isActive"); });

        // css classes
        let layerMenuClasses = MiscUtil.generateStringFromSet({
            "open": this.props.layerMenuOpen
        });

        return (
            <div id="layerMenu" className={layerMenuClasses}>
                <div id="layer-header-row" className="row middle-xs">
                    <div className="col-xs-8 text-left">
                        <span className="menu-header">Layer Controls</span>
                        <span className="note">({activeNum} of {totalNum} active)</span>
                    </div>
                    <div className="col-xs-4 text-right">
                        <Button flat className="small" label={this.props.layerMenuOpen ? "close" : "open"} onClick={this.props.toggleLayerMenu} />
                    </div>
                </div>
                <hr className="divider dark wide no-margin" />
                <div id="layerMenuContent">
                    {layerList.map((layer) =>
                        <LayerControlContainer
                            key={layer.get("id") + "_layer_listing"}
                            layer={layer}
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
    layers: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        layerMenuOpen: state.view.get("layerMenuOpen"),
        layers: state.map.getIn(["layers", "data"])
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
