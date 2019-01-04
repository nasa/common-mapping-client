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
import MapUtil from "_core/utils/MapUtil";

const LonLatCoordinates = props => {
    let displayText = MapUtil.formatLatLon(props.lat, props.lon, !props.invalid);

    let containerClasses = MiscUtil.generateStringFromSet({
        [props.className]: typeof props.className !== "undefined"
    });

    return (
        <Typography
            variant="body2"
            color="inherit"
            className={containerClasses}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: displayText }}
        />
    );
};

LonLatCoordinates.propTypes = {
    lat: PropTypes.number.isRequired,
    lon: PropTypes.number.isRequired,
    invalid: PropTypes.bool,
    className: PropTypes.string
};

export default LonLatCoordinates;
