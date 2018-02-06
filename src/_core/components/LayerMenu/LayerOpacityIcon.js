/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from "react";
import PropTypes from "prop-types";
import { IconButtonSmall } from "_core/components/Reusables";
import {
    OpacityIcon0,
    OpacityIcon25,
    OpacityIcon50,
    OpacityIcon75,
    OpacityIcon100
} from "_core/components/Reusables/CustomIcons";

const LayerOpacityIcon = props => {
    let { opacity, ...other } = props;

    let currOpacity = Math.floor(props.opacity * 100);
    let opacityIcon =
        currOpacity === 0 ? (
            <OpacityIcon0 />
        ) : currOpacity < 50 ? (
            <OpacityIcon25 />
        ) : currOpacity < 75 ? (
            <OpacityIcon50 />
        ) : currOpacity < 100 ? (
            <OpacityIcon75 />
        ) : (
            <OpacityIcon100 />
        );

    return <IconButtonSmall {...other}>{opacityIcon}</IconButtonSmall>;
};

LayerOpacityIcon.propTypes = {
    opacity: PropTypes.number.isRequired
};

export default LayerOpacityIcon;
