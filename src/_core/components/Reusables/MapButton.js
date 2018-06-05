/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import styles from "_core/components/Reusables/MapButton.scss";

const MapButton = props => {
    return (
        <Button
            classes={{
                root: styles.mapButton,
                label: styles.label,
                flatPrimary: styles.flatPrimary
            }}
            {...props}
        />
    );
};

export default MapButton;
