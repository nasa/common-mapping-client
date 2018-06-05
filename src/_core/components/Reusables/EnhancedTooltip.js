/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from "react";
import PropTypes from "prop-types";
import Tooltip from "@material-ui/core/Tooltip";

const EnhancedTooltip = props => {
    return <Tooltip PopperProps={{ style: { pointerEvents: "none" } }} {...props} />;
};

export default EnhancedTooltip;
