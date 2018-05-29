/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import MiscUtil from "_core/utils/MiscUtil";
import styles from "_core/components/LayerMenu/LayerControlLabel.scss";

const LayerControlLabel = props => {
    let containerClasses = MiscUtil.generateStringFromSet({
        [styles.controlLabel]: true,
        [props.className]: typeof props.className !== "undefined"
    });
    return <div className={containerClasses}>{props.children}</div>;
};

LayerControlLabel.propTypes = {
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.string]),
    className: PropTypes.string
};

export default LayerControlLabel;
