/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from "react";
import PropTypes from "prop-types";
import Paper from "material-ui/Paper";
import "rc-slider/assets/index.css";
import styles from "_core/components/LayerMenu/LayerOpacityControl.scss";
import Slider from "rc-slider";
import { Arrow } from "react-popper";
import { LayerControlLabel } from "_core/components/LayerMenu";

const LayerOpacityControl = props => {
    let currOpacity = Math.floor(props.opacity * 100);
    return (
        <div>
            <Paper elevation={8} className={styles.opacityControl}>
                <LayerControlLabel>Layer Opacity</LayerControlLabel>
                <div className={styles.opacityContent}>
                    <Slider
                        min={0}
                        max={100}
                        step={10}
                        value={props.opacity * 100}
                        className={styles.sliderRoot}
                        onChange={value => props.onChange(value)}
                    />
                    <span className={styles.opacityLabel}>{currOpacity}%</span>
                </div>
            </Paper>
            <Arrow className={styles.popperArrow} />
        </div>
    );
};

LayerOpacityControl.propTypes = {
    isActive: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    opacity: PropTypes.number.isRequired
};

export default LayerOpacityControl;
