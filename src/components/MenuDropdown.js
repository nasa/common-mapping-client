import React from 'react';
import Dropdown from 'react-toolbox/lib/dropdown';

const MenuDropdown = (props) => {
    let customItem = (item) => {
        return (
            <div className="dropdown-item">
                <span className="dropdown-item-label">{item.label}</span>
                <small>{item.abbrev}</small>
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
export default MenuDropdown;
