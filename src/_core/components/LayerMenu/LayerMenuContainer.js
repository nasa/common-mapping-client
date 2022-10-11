/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Collapse from "@material-ui/core/Collapse";
import Typography from "@material-ui/core/Typography";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import List from "@material-ui/core/List";
import Paper from "@material-ui/core/Paper";
import * as appStrings from "_core/constants/appStrings";
import * as mapActions from "_core/actions/mapActions";
import { LayerControlContainer } from "_core/components/LayerMenu";
import { IconButtonSmall, EnhancedTooltip } from "_core/components/Reusables";
import MiscUtil from "_core/utils/MiscUtil";
import styles from "_core/components/LayerMenu/LayerMenuContainer.scss";
import displayStyles from "_core/styles/display.scss";

export class LayerMenuContainer extends Component {
    render() {
        let layerList = this.props.layers
            .filter(layer => !layer.get("isDisabled"))
            .toList()
            .sort(MiscUtil.getImmutableObjectSort("title"));
        let totalNum = layerList.size;
        let activeNum = layerList.count(el => {
            return el.get("isActive");
        });

        // css classes
        let layerMenuClasses = MiscUtil.generateStringFromSet({
            [styles.layerMenu]: true,
            [styles.open]: this.props.layerMenuOpen,
            [displayStyles.hiddenFadeOut]: this.props.distractionFreeMode,
            [displayStyles.hiddenFadeIn]: !this.props.distractionFreeMode,
            [this.props.className]: typeof this.props.className !== "undefined"
        });

        let collapseIconClasses = MiscUtil.generateStringFromSet({
            [styles.expand]: !this.props.layerMenuOpen,
            [styles.collapse]: this.props.layerMenuOpen
        });

        return (
            <div className={layerMenuClasses}>
                <Paper elevation={1}>
                    <div className={styles.layerHeaderRow}>
                        <div className={styles.layerHeader}>
                            <Typography variant="subtitle1" color="inherit">
                                Map Layers
                            </Typography>
                        </div>
                        <div className="text-right">
                            <EnhancedTooltip
                                title={
                                    this.props.layerMenuOpen
                                        ? "Close layer menu"
                                        : "Open layer menu"
                                }
                                placement="bottom"
                            >
                                <IconButtonSmall
                                    className={collapseIconClasses}
                                    color="default"
                                    onClick={() =>
                                        this.props.setLayerMenuOpen(!this.props.layerMenuOpen)
                                    }
                                >
                                    <KeyboardArrowDownIcon />
                                </IconButtonSmall>
                            </EnhancedTooltip>
                        </div>
                    </div>
                    <Collapse in={this.props.layerMenuOpen} timeout="auto">
                        <div className={styles.layerMenuContent}>
                            <List disablePadding>
                                {layerList.map(layer => (
                                    <LayerControlContainer
                                        key={layer.get("id") + "_layer_listing"}
                                        layer={layer}
                                        activeNum={activeNum}
                                        palette={this.props.palettes.get(
                                            layer.getIn(["palette", "name"])
                                        )}
                                    />
                                ))}
                            </List>
                        </div>
                    </Collapse>
                </Paper>
            </div>
        );
    }
}

LayerMenuContainer.propTypes = {
    setLayerMenuOpen: PropTypes.func.isRequired,
    layerMenuOpen: PropTypes.bool.isRequired,
    layers: PropTypes.object.isRequired,
    distractionFreeMode: PropTypes.bool.isRequired,
    palettes: PropTypes.object.isRequired,
    className: PropTypes.string
};

function mapStateToProps(state) {
    return {
        layerMenuOpen: state.view.get("layerMenuOpen"),
        layers: state.map.getIn(["layers", appStrings.LAYER_GROUP_TYPE_DATA]),
        palettes: state.map.get("palettes"),
        distractionFreeMode: state.view.get("distractionFreeMode")
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setLayerMenuOpen: bindActionCreators(mapActions.setLayerMenuOpen, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LayerMenuContainer);
