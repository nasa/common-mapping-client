import React, { PropTypes } from 'react';
import Ripple from 'react-toolbox/lib/ripple';
import MiscUtil from '../utils/MiscUtil';

const BaseObj = (props) => {
    let wrapperClasses = MiscUtil.generateStringFromSet({
        "basemap-preview": true,
        "active": props.layer.get("isActive")
    });
    return (
        <div {...props} className={wrapperClasses}>
            <div className="img-wrapper">
                <img src={props.layer.get("thumbnailImage") ? props.layer.get("thumbnailImage") : "/styles/resources/img/no_tile.png"} className="basemap-preview-img" alt="basemap preview image" />
                {props.children}
            </div>
            <div className="basemap-preview-label">{props.layer.get("title")}</div>
        </div>
    );
};
BaseObj.propTypes = {
    children: PropTypes.array.isRequired,
    layer: PropTypes.object.isRequired
};
const BaseMapPreview = Ripple({ spread: 3 })(BaseObj);

export default BaseMapPreview;
