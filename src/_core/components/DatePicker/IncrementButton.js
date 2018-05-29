/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import { IncrementIcon } from "_core/components/DatePicker";
import styles from "_core/components/DatePicker/IncrementButton.scss";

const IncrementButton = props => {
    let { decrement, ...other } = props;
    return (
        <Button tabIndex="-1" classes={{ root: styles.root, label: styles.label }} {...other}>
            <IncrementIcon decrement={props.decrement} />
        </Button>
    );
};

IncrementButton.propTypes = {
    decrement: PropTypes.bool
};

export default IncrementButton;
