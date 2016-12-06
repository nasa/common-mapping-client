import React from 'react';
import Dropdown from 'react-toolbox/lib/dropdown';
require('_core/styles/resources/img/no_tile.png');


const BaseMapDropdown = (props) => {
    let customItem = (item) => {
        return (
            <div className="basemap-dropdown-item row middle-xs">
                <div className="item-label col-xs-2">
                    <img src={item.thumbnailImage ? item.thumbnailImage : "img/no_tile.png"} className="basemap-preview-img" alt="basemap preview image" />
                </div>
                <div className="item-label col-xs-10">{item.label}</div>
            </div>
        );
    };
    return (
        <Dropdown
            {...props}
            template={customItem}
        />
    );
};
export default BaseMapDropdown;
