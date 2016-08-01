import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, IconButton } from 'react-toolbox/lib/button';
import Switch from 'react-toolbox/lib/switch';
import Slider from 'react-toolbox/lib/slider';
import * as layerActions from '../../actions/LayerActions';
import ColorbarContainer from './ColorbarContainer';
import MiscUtil from '../../utils/MiscUtil';

export class LayerControlContainer extends Component {
    changeOpacity(value) {
        let opacity = value / 100.00;
        this.props.actions.setLayerOpacity(this.props.layer, opacity);
    }

    toggleChangingOpacity() {
        if (this.props.layer.get("isChangingOpacity")) {
            this.stopChangingOpacity();
        } else {
            this.startChangingOpacity();
        }
    }

    startChangingOpacity() {
        this.props.actions.startChangingLayerOpacity(this.props.layer);
    }

    stopChangingOpacity() {
        this.props.actions.stopChangingLayerOpacity(this.props.layer);
    }

    toggleChangingPosition() {
        if (this.props.layer.get("isChangingPosition")) {
            this.stopChangingPosition();
        } else {
            this.startChangingPosition();
        }
    }

    startChangingPosition() {
        this.props.actions.startChangingLayerPosition(this.props.layer);
    }

    stopChangingPosition() {
        this.props.actions.stopChangingLayerPosition(this.props.layer);
    }

    openLayerInfo() {
        this.props.actions.openLayerInfo(this.props.layer);
    }

    changePalette() {
        this.props.actions.changeLayerPalette(this.props.layer, {});
    }

    moveToTop() {
        this.props.actions.moveLayerToTop(this.props.layer);
    }
    moveToBottom() {
        this.props.actions.moveLayerToBottom(this.props.layer);
    }
    moveUp() {
        this.props.actions.moveLayerUp(this.props.layer);
    }
    moveDown() {
        this.props.actions.moveLayerDown(this.props.layer);
    }

    render() {
        let switchClasses = MiscUtil.generateStringFromSet({
            "layer-toggle": true,
            "active": this.props.layer.get("isActive")
        });
        let sliderContainerClasses = MiscUtil.generateStringFromSet({
            "opacity-slider-container row middle-xs": true,
            "active": this.props.layer.get("isChangingOpacity")
        });
        let positionContainerClasses = MiscUtil.generateStringFromSet({
            "position-controls-container text-wrap row middle-xs": true,
            "active": this.props.layer.get("isChangingPosition")
        });
        let colorbarRangeClasses = MiscUtil.generateStringFromSet({
            "row middle-xs": true,
            "hidden": this.props.layer.getIn(["palette", "handleAs"]) === ""
        });
        let currOpacity = Math.floor(this.props.layer.get("opacity") * 100);
        return (
            <div className="layer-control pos-rel">
                <div className="row middle-xs">
                    <div className="col-xs-2 text-left toggle">
                        <div data-tip={this.props.layer.get("isActive") ? "Hide Layer" : "Show Layer"}
                            data-place="left">
                            <Switch
                                className={switchClasses}
                                checked={this.props.layer.get("isActive")}
                                onChange={(active) => this.props.actions.setLayerActive(this.props.layer, active)}
                            />
                        </div>
                    </div>
                    <span className="col-xs layer-header text-wrap">{this.props.layer.get("title")}</span>
                </div>
                <div className="row middle-xs">
                    <div className="col-xs-9 text-left no-padding">
                        <ColorbarContainer
                            palette={this.props.palette}
                            min={this.props.layer.get("min")}
                            max={this.props.layer.get("max")}
                            displayMin={this.props.layer.getIn(["palette", "min"])}
                            displayMax={this.props.layer.getIn(["palette", "max"])}
                            handleAs={this.props.layer.getIn(["palette", "handleAs"])}
                            url={this.props.layer.getIn(["palette", "url"])}
                        />
                    </div>
                    <div className="col-xs-3 text-center">
                        <IconButton
                            flat
                            // primary={!this.props.layer.get("isChangingPosition")}
                            accent={this.props.layer.get("isChangingPosition")}
                            disabled={!this.props.layer.get("isActive")}
                            className="no-padding mini-xs-waysmall"
                            data-tip={!this.props.layer.get("isChangingPosition") ? "Adjust layer positioning" : null}
                            data-place="left"
                            onClick={() => this.toggleChangingPosition()}>
                            <i className="button-icon ms ms-fw ms-layers-overlay"></i>
                        </IconButton>
                        <IconButton
                            flat
                            // primary={!this.props.layer.get("isChangingOpacity")}
                            accent={this.props.layer.get("isChangingOpacity")}
                            disabled={!this.props.layer.get("isActive")}
                            className="no-padding mini-xs-waysmall"
                            data-tip={!this.props.layer.get("isChangingOpacity") ? "Adjust layer opacity" : null}
                            data-place="left"
                            onClick={() => this.toggleChangingOpacity()}>
                            <i className="button-icon ms ms-fw ms-opacity"></i>
                        </IconButton>
                        <IconButton
                            flat
                            // primary
                            icon="info_outline"
                            className="no-padding mini-xs-waysmall"
                            data-tip="Layer information"
                            data-place="left"
                            onClick={() => this.openLayerInfo()}
                        />
                    </div>
                </div>
                <div className={colorbarRangeClasses}>
                    <div className="col-xs-12 no-padding">
                        <div className="colorbar-label-container pos-rel">
                            <span className="colorbar-label min">
                                {this.props.layer.get("min")}
                            </span>
                            <span className="colorbar-label mid">
                                {this.props.layer.get("units")}
                            </span>
                            <span className="colorbar-label max">
                                {this.props.layer.get("max")}
                            </span>
                        </div>
                    </div>
                </div>
                <div className={sliderContainerClasses}>
                    <Slider min={0} max={100} step={10} value={this.props.layer.get("opacity") * 100} className="opacity-slider col-xs-9 no-padding" onChange={(value) => this.changeOpacity(value)} />
                    <span className="opacity-label col-xs-3 no-padding">
                        {currOpacity}%
                    </span>
                </div>
                <div className={positionContainerClasses}>
                    <Button accent label="Top" className="position-control-button col-xs-6" onClick={() => this.moveToTop()}/>
                    <Button accent label="Up" className="position-control-button col-xs-6" onClick={() => this.moveUp()}/>
                    <Button accent label="Bottom" className="position-control-button col-xs-6" onClick={() => this.moveToBottom()}/>
                    <Button accent label="Down" className="position-control-button col-xs-6" onClick={() => this.moveDown()}/>
                </div>
            </div>
        );
    }
}

LayerControlContainer.propTypes = {
    actions: PropTypes.object.isRequired,
    layer: PropTypes.object.isRequired,
    palette: PropTypes.object
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
