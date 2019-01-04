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
import styles from "_core/components/AppBar/AppTitle.scss";

const renderTitle = title => {
    if (title) {
        return (
            <Typography variant="h6" color="inherit" className={styles.title}>
                {title}
            </Typography>
        );
    }
};

const renderVersion = version => {
    if (version) {
        return (
            <Typography variant="caption" color="inherit" className={styles.version}>
                {version}
            </Typography>
        );
    }
};

const AppTitle = props => {
    let { title, version, className, ...other } = props;

    let rootClasses = MiscUtil.generateStringFromSet({
        [className]: typeof className !== "undefined"
    });

    return (
        <div className={rootClasses} {...other}>
            {renderTitle(title)}
            {renderVersion(version)}
        </div>
    );
};

AppTitle.propTypes = {
    title: PropTypes.string.isRequired,
    version: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    className: PropTypes.string
};

export default AppTitle;
