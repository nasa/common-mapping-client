/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { ContextMenu } from "react-contextmenu";
import { hideMenu } from "react-contextmenu/modules/actions";
import { MapToolsMenu } from "_core/components/Reusables";
import MiscUtil from "_core/utils/MiscUtil";
import * as appStrings from "_core/constants/appStrings";

export class MapContextMenu extends Component {
    render() {
        let containerClasses = MiscUtil.generateStringFromSet({
            [this.props.className]: typeof this.props.className !== "undefined"
        });
        return (
            <ContextMenu id={appStrings.MAP_CONTEXT_MENU_ID} className={containerClasses}>
                <MapToolsMenu handleRequestClose={() => hideMenu()} />
            </ContextMenu>
        );
    }
}

MapContextMenu.propTypes = {
    className: PropTypes.string
};

export default MapContextMenu;
