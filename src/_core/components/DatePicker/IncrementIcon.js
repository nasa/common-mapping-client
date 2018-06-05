/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import styles from "_core/components/DatePicker/IncrementIcon.scss";

const IncrementIcon = props => {
    let { decrement, ...other } = props;
    if (props.decrement) {
        return <KeyboardArrowDownIcon classes={{ root: styles.root }} {...other} />;
    }
    return <KeyboardArrowUpIcon classes={{ root: styles.root }} {...other} />;
};

IncrementIcon.propTypes = {
    decrement: PropTypes.bool
};

export default IncrementIcon;
