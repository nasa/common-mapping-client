import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, IconButton } from 'react-toolbox/lib/button';
import { Scrollbars } from 'react-custom-scrollbars';
import * as appConfig from '../../constants/appConfig';
import * as mapStrings from '../../constants/mapStrings';
import * as layerActions from '../../actions/LayerActions';
import LayerControlContainer from './LayerControlContainer';
import MiscUtil from '../../utils/MiscUtil';

export class LayerMenuContainer extends Component {
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

        // scrollbar rendering
        let renderThumb = ({ style, ...props }) => {
            return (
                <div
                    style={{ ...style }}
                    className="scrollbar-thumb"
                    {...props}
                />
            );
        };
        let renderHorizTrack = ({style, ...props}) => {
            return (
                <div
                    style={{display:"none"}}
                />
            );
        }

        // scrollbar hack
        let scrollStyle = appConfig.BROWSER_ID.isFirefox || appConfig.BROWSER_ID.isSafari  ? {"height":"100%"} : {};

        return (
            <div id="layerMenu" className={layerMenuClasses}>
                <div id="layerHeaderRow" className="row middle-xs">
                    <div className="col-xs-8 text-left">
                        <span className="layer-menu-header">LAYER CONTROLS</span>
                        <span className="layer-menu-note"><span className="layer-menu-note-active">{activeNum}</span>/{totalNum} Active</span>
                    </div>
                    <div className="col-xs-4 text-right">
                        <IconButton
                            neutral
                            inverse
                            icon={this.props.layerMenuOpen ? "keyboard_arrow_up" : "keyboard_arrow_down"}
                            className="no-padding mini-xs-waysmall"
                            onMouseUp={() => this.props.setLayerMenuOpen(!this.props.layerMenuOpen)}
                        />
                    </div>
                </div>
                <div id="layerMenuContent">
                    <Scrollbars 
                        style={scrollStyle}
                        autoHeight
                        autoHeightMin={0}
                        autoHeightMax={"100%"}
                        renderThumbVertical={renderThumb}
                        renderTrackHorizontal={renderHorizTrack}>
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
    palettes: PropTypes.object.isRequired,
    sliderCollapsed: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
    return {
        layerMenuOpen: state.view.get("layerMenuOpen"),
        layers: state.map.getIn(["layers", mapStrings.LAYER_GROUP_TYPE_DATA]),
        palettes: state.map.get("palettes"),
        sliderCollapsed: state.dateSlider.get("sliderCollapsed")
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
