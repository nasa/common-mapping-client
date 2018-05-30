/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from "react";
import PropTypes from "prop-types";
import Popover from "@material-ui/core/Popover";
import Grow from "@material-ui/core/Grow";
import { Manager, Target, Popper } from "react-popper";
import BuildIcon from "@material-ui/icons/Build";
import {
    MapButton,
    MapToolsMenu,
    ClickAwayListener,
    EnhancedTooltip
} from "_core/components/Reusables";
import mapControlsContainerStyles from "_core/components/Map/MapControlsContainer.scss";
import MiscUtil from "_core/utils/MiscUtil";
import displayStyles from "_core/styles/display.scss";

const MapToolsButton = props => {
    let btnClasses = MiscUtil.generateStringFromSet({
        [props.className]: typeof props.className !== "undefined"
    });
    return (
        <ClickAwayListener
            onClickAway={() => {
                if (props.isOpen) {
                    props.setOpen(false);
                }
            }}
        >
            <Manager>
                <Target>
                    <EnhancedTooltip title="Tools" placement="right">
                        <MapButton
                            color={props.isOpen ? "primary" : "default"}
                            onClick={() => {
                                props.setOpen(!props.isOpen);
                            }}
                            aria-label="Tools"
                            className={btnClasses}
                        >
                            <BuildIcon />
                        </MapButton>
                    </EnhancedTooltip>
                </Target>
                <Popper
                    placement="left-end"
                    style={{ marginRight: "5px", zIndex: "3001" }}
                    modifiers={{
                        computeStyle: {
                            gpuAcceleration: false
                        }
                    }}
                    eventsEnabled={props.isOpen}
                    className={!props.isOpen ? displayStyles.noPointer : ""}
                >
                    <Grow style={{ transformOrigin: "right bottom" }} in={props.isOpen}>
                        <div>
                            <MapToolsMenu
                                handleRequestClose={() => {
                                    if (props.isOpen) {
                                        props.setOpen(false);
                                    }
                                }}
                            />
                        </div>
                    </Grow>
                </Popper>
            </Manager>
        </ClickAwayListener>
    );
};

MapToolsButton.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    className: PropTypes.string
};

export default MapToolsButton;
