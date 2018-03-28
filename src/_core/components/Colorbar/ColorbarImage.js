/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import MiscUtil from "_core/utils/MiscUtil";

export class ColorbarImage extends Component {
    render() {
        let containerClasses = MiscUtil.generateStringFromSet({
            [this.props.className]: typeof this.props.className !== "undefined"
        });

        return <img className={containerClasses} src={this.props.url} />;
    }
}

ColorbarImage.propTypes = {
    url: PropTypes.string,
    className: PropTypes.string
};

export default ColorbarImage;
