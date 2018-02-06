/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from "react";
import PropTypes from "prop-types";
import MiscUtil from "_core/utils/MiscUtil";

const Spinner = props => {
    let { className, primary, ...other } = props;
    let rootClasses = MiscUtil.generateStringFromSet({
        loadingSpinnerWrapper: true,
        [className]: typeof className !== "undefined"
    });

    let spinnerClasses = MiscUtil.generateStringFromSet({
        loadingSpinner: true,
        primary: typeof primary === "undefined" || primary
    });

    return (
        <div className={rootClasses} {...other}>
            <div className={spinnerClasses}>
                <div className="loadingSpinnerRotator">
                    <div className="loadingSpinnerLeft">
                        <div className="loadingSpinnerCircle" />
                    </div>
                    <div className="loadingSpinnerRight">
                        <div className="loadingSpinnerCircle" />
                    </div>
                </div>
            </div>
        </div>
    );
};

Spinner.propTypes = {
    className: PropTypes.string,
    primary: PropTypes.bool
};

export default Spinner;
