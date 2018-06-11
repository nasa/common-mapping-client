/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from "react";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import "rc-slider/assets/index.css";
import styles from "_core/components/LayerMenu/LayerOpacityControl.scss";
import Slider from "rc-slider";
import MiscUtil from "_core/utils/MiscUtil";
import { LayerControlLabel } from "_core/components/LayerMenu";

const LayerOpacityControl = props => {
    let currOpacity = Math.floor(props.opacity * 100);
    let containerClasses = MiscUtil.generateStringFromSet({
        [styles.opacityControl]: true,
        [props.className]: typeof props.className !== "undefined"
    });
    return (
        <div>
            <Paper elevation={8} className={containerClasses}>
                <LayerControlLabel>Layer Opacity</LayerControlLabel>
                <div className={styles.opacityContent}>
                    <span className={styles.opacityLabel}>{currOpacity}%</span>
                    <Slider
                        min={0}
                        max={100}
                        step={10}
                        value={props.opacity * 100}
                        className={styles.sliderRoot}
                        onChange={value => props.onChange(value)}
                    />
                </div>
            </Paper>
        </div>
    );
};

LayerOpacityControl.propTypes = {
    isActive: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    opacity: PropTypes.number.isRequired,
    className: PropTypes.string
};

export default LayerOpacityControl;
