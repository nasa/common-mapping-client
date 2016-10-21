import React, { PropTypes } from 'react';
import MiscUtil from '../../utils/MiscUtil';

const LoadingSpinner = (props) => {
    let containerClasses = MiscUtil.generateStringFromSet({
        "loading-spinner": true,
        "hidden": !props.active
    });
    return (
        <div className={containerClasses}>
            <svg className="circular" viewBox="25 25 50 50">
              <circle className="path" cx="50" cy="50" r="20" fill="none"/>
            </svg>
        </div>
    );
};

LoadingSpinner.propTypes = {
    active: PropTypes.bool.isRequired
};
export default LoadingSpinner;
