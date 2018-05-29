/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from "react";
import PropTypes from "prop-types";
import IconButton from "@material-ui/core/IconButton";
import styles from "_core/components/Reusables/IconButtonSmall.scss";

const IconButtonSmall = props => {
    return <IconButton classes={{ root: styles.root, label: styles.label }} {...props} />;
};

export default IconButtonSmall;
