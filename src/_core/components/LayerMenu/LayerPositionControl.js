/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { LayerControlLabel } from "_core/components/LayerMenu";
import MiscUtil from "_core/utils/MiscUtil";
import styles from "_core/components/LayerMenu/LayerPositionControl.scss";

const LayerPositionControl = props => {
    let containerClasses = MiscUtil.generateStringFromSet({
        [props.className]: typeof props.className !== "undefined"
    });
    return (
        <div className={containerClasses}>
            <Paper elevation={8} className={styles.positionControl}>
                <LayerControlLabel>Layer Positioning</LayerControlLabel>
                <div className={styles.buttonRow}>
                    <Button
                        className={styles.positionButton}
                        color="primary"
                        onClick={() => props.moveToTop()}
                    >
                        Top
                    </Button>
                    <Button
                        className={styles.positionButton}
                        color="primary"
                        onClick={() => props.moveUp()}
                    >
                        Up
                    </Button>
                </div>
                <div className={styles.buttonRow}>
                    <Button
                        className={styles.positionButton}
                        color="primary"
                        onClick={() => props.moveToBottom()}
                    >
                        Bottom
                    </Button>
                    <Button
                        className={styles.positionButton}
                        color="primary"
                        onClick={() => props.moveDown()}
                    >
                        Down
                    </Button>
                </div>
            </Paper>
        </div>
    );
};

LayerPositionControl.propTypes = {
    isActive: PropTypes.bool.isRequired,
    moveToTop: PropTypes.func.isRequired,
    moveToBottom: PropTypes.func.isRequired,
    moveUp: PropTypes.func.isRequired,
    moveDown: PropTypes.func.isRequired,
    className: PropTypes.string
};

export default LayerPositionControl;
