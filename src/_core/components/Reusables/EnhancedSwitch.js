/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from "react";
import PropTypes from "prop-types";
import Switch from "@material-ui/core/Switch";
import styles from "_core/components/Reusables/EnhancedSwitch.scss";

const EnhancedSwitch = props => {
    return (
        <Switch
            classes={{
                root: styles.root,
                switchBase: styles.default,
                bar: styles.bar,
                checked: styles.checked,
                icon: styles.icon
            }}
            {...props}
        />
    );
};

export default EnhancedSwitch;
