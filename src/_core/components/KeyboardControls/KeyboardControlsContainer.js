/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import moment from "moment";
import * as mapActions from "_core/actions/mapActions";
import * as dateSliderActions from "_core/actions/dateSliderActions";
import appConfig from "constants/appConfig";
import * as appStrings from "_core/constants/appStrings";
import KeyHandler, { KEYUP, KEYDOWN } from "react-key-handler";
import displayStyles from "_core/styles/display.scss";

const SPEED_FAST = 150;
const SPEED_SLOW = 500;

export class KeyboardControlsContainer extends Component {
    constructor(props) {
        super(props);

        // Instance variables are used here since these variables are purely interaction
        // based and are never intended to be affected by application state or affect application state.
        this.dateAutoIncrementInterval = null;
        this.dateShouldAutoIncrement = false;
        this.dateAutoIncrementSpeed = SPEED_SLOW;
        this.dateIncrementForward = true;
        this.dateAutoIncrementEnabled = true;

        this.panAutoIncrementInterval = null;
        this.panShouldAutoIncrement = false;
        this.panAutoIncrementSpeed = 200;
        this.panExtraFar = false;
        this.panAutoIncrementDirection = appStrings.MAP_PAN_DIRECTION_UP;
        this.panAutoIncrementEnabled = true;
    }

    shouldComponentUpdate(nextProps) {
        return false;
    }

    handleKeyUp_Escape() {
        if (this.props.isDrawingEnabled) {
            this.props.mapActions.disableDrawing();
        }
        if (this.props.isMeasuringEnabled) {
            this.props.mapActions.disableMeasuring();
        }
    }

    handleKeyUp_Enter() {
        let map = this.props.maps.get(appStrings.MAP_LIB_2D);
        if (typeof map !== "undefined") {
            if (this.props.isDrawingEnabled) {
                map.completeDrawing();
            }
            if (this.props.isMeasuringEnabled) {
                map.completeMeasuring();
            }
        }
    }

    incrementDate(resolution, increment = true) {
        let newDate = moment(this.props.date);
        if (increment) {
            newDate = newDate.add(1, resolution);
        } else {
            newDate = newDate.subtract(1, resolution);
        }

        let minDate = moment(appConfig.MIN_DATE);
        let maxDate = moment(appConfig.MAX_DATE);

        if (newDate.isBetween(minDate, maxDate)) {
            this.props.mapActions.setDate(newDate.toDate());
        }
    }

    dateAutoIncrement() {
        if (this.dateShouldAutoIncrement) {
            clearTimeout(this.dateAutoIncrementInterval);
            this.incrementDate(
                this.props.dateSliderTimeResolution.get("label"),
                this.dateIncrementForward
            );
            this.dateAutoIncrementInterval = setTimeout(
                () => this.dateAutoIncrement(),
                this.dateAutoIncrementSpeed
            );
        }
    }

    beginDateAutoIncrement(increment) {
        if (this.dateAutoIncrementEnabled) {
            this.dateShouldAutoIncrement = true;
            this.dateIncrementForward = increment;
            if (this.dateAutoIncrementInterval === null) {
                this.dateAutoIncrementInterval = setTimeout(
                    () => this.dateAutoIncrement(),
                    this.dateAutoIncrementSpeed
                );
                this.incrementDate(
                    this.props.dateSliderTimeResolution.get("label"),
                    this.dateIncrementForward
                );
            }
        }
    }

    endDateAutoIncrement() {
        clearTimeout(this.dateAutoIncrementInterval);
        this.dateShouldAutoIncrement = false;
        this.dateAutoIncrementInterval = null;
    }

    setDateAutoIncrementSpeed(speed) {
        this.dateAutoIncrementSpeed = speed;
    }

    disableDateAutoIncrement() {
        this.dateAutoIncrementEnabled = false;
        this.endDateAutoIncrement();
    }

    enableDateAutoIncrement() {
        this.dateAutoIncrementEnabled = true;
    }

    panAutoIncrement() {
        if (this.panShouldAutoIncrement) {
            clearTimeout(this.panAutoIncrementInterval);
            this.panMap(this.panAutoIncrementDirection);
            this.panAutoIncrementInterval = setTimeout(
                () => this.panAutoIncrement(),
                this.panAutoIncrementSpeed
            );
        }
    }

    beginMapAutoPan(direction) {
        if (this.panAutoIncrementEnabled) {
            this.panShouldAutoIncrement = true;
            this.panAutoIncrementDirection = direction;
            if (this.panAutoIncrementInterval === null) {
                this.panAutoIncrementInterval = setTimeout(
                    () => this.panAutoIncrement(),
                    this.panAutoIncrementSpeed
                );
                this.panMap(this.panAutoIncrementDirection);
            }
        }
    }

    endMapAutoPan() {
        clearTimeout(this.panAutoIncrementInterval);
        this.panShouldAutoIncrement = false;
        this.panAutoIncrementInterval = null;
    }

    adjustDateSliderTimeResolution(up) {
        let currResLabel = this.props.dateSliderTimeResolution.get("label");
        let currResIndex = appConfig.DATE_SLIDER_RESOLUTIONS.reduce((acc, res, i) => {
            if (res.label === currResLabel) {
                return i;
            }
            return acc;
        }, 0);
        let newResIndex = currResIndex + (up ? -1 : 1);
        newResIndex = Math.min(
            Math.max(newResIndex, 0),
            appConfig.DATE_SLIDER_RESOLUTIONS.length - 1
        );
        this.props.dateSliderActions.setDateResolution(
            appConfig.DATE_SLIDER_RESOLUTIONS[newResIndex]
        );
    }

    handleKeyDown_ArrowUp() {
        // Key conflicts: Timeline resolution and layer menu opacity slider
        // let focusEl = document.activeElement.getAttribute("data-react-toolbox");
        // If we're focused on slider, do not adjust timeline
        // if (focusEl !== "slider") {
        this.adjustDateSliderTimeResolution(false);
        // }
    }

    handleKeyDown_ArrowDown() {
        // Key conflicts: Timeline resolution and layer menu opacity slider
        // let focusEl = document.activeElement.getAttribute("data-react-toolbox");
        // If we're focused on slider, do not adjust timeline
        // if (focusEl !== "slider") {
        this.adjustDateSliderTimeResolution(true);
        // }
    }

    zoomIn() {
        this.props.mapActions.zoomIn();
    }

    zoomOut() {
        this.props.mapActions.zoomOut();
    }

    panMap(direction) {
        this.props.mapActions.panMap(direction, this.panExtraFar);
    }

    speedUp() {
        this.setDateAutoIncrementSpeed(SPEED_FAST);
        this.panExtraFar = true;
    }

    speedDown() {
        this.setDateAutoIncrementSpeed(SPEED_SLOW);
        this.panExtraFar = false;
    }

    handleMetaKey() {
        this.endDateAutoIncrement();
        this.endMapAutoPan();
        this.speedDown();
    }

    render() {
        return (
            <div className={displayStyles.hidden}>
                <KeyHandler
                    keyEventName={KEYUP}
                    keyValue="Escape"
                    onKeyHandle={evt => this.handleKeyUp_Escape()}
                />

                <KeyHandler
                    keyEventName={KEYUP}
                    keyValue="Enter"
                    onKeyHandle={evt => this.handleKeyUp_Enter()}
                />

                <KeyHandler
                    keyEventName={KEYDOWN}
                    keyValue="Meta"
                    onKeyHandle={() => this.handleMetaKey()}
                />
                <KeyHandler
                    keyEventName={KEYUP}
                    keyValue="Meta"
                    onKeyHandle={() => this.handleMetaKey()}
                />

                {/* Speed Control */}
                <KeyHandler
                    keyEventName={KEYDOWN}
                    keyValue="Shift"
                    onKeyHandle={() => this.speedUp()}
                />
                <KeyHandler
                    keyEventName={KEYUP}
                    keyValue="Shift"
                    onKeyHandle={() => this.speedDown()}
                />

                {/* Date Changing */}
                <KeyHandler
                    keyEventName={KEYDOWN}
                    keyValue="ArrowLeft"
                    onKeyHandle={() => this.beginDateAutoIncrement(false)}
                />
                <KeyHandler
                    keyEventName={KEYUP}
                    keyValue="ArrowLeft"
                    onKeyHandle={() => this.endDateAutoIncrement()}
                />

                <KeyHandler
                    keyEventName={KEYDOWN}
                    keyValue="ArrowRight"
                    onKeyHandle={() => this.beginDateAutoIncrement(true)}
                />
                <KeyHandler
                    keyEventName={KEYUP}
                    keyValue="ArrowRight"
                    onKeyHandle={() => this.endDateAutoIncrement()}
                />

                <KeyHandler
                    keyEventName={KEYUP}
                    keyValue="ArrowUp"
                    onKeyHandle={() => this.handleKeyDown_ArrowUp()}
                />
                <KeyHandler
                    keyEventName={KEYUP}
                    keyValue="ArrowDown"
                    onKeyHandle={() => this.handleKeyDown_ArrowDown()}
                />

                {/* Map Movement */}
                <KeyHandler keyEventName={KEYUP} keyValue="q" onKeyHandle={() => this.zoomOut()} />
                <KeyHandler keyEventName={KEYUP} keyValue="Q" onKeyHandle={() => this.zoomOut()} />

                <KeyHandler keyEventName={KEYUP} keyValue="e" onKeyHandle={() => this.zoomIn()} />
                <KeyHandler keyEventName={KEYUP} keyValue="E" onKeyHandle={() => this.zoomIn()} />

                <KeyHandler
                    keyEventName={KEYDOWN}
                    keyValue="w"
                    onKeyHandle={() => this.beginMapAutoPan(appStrings.MAP_PAN_DIRECTION_UP)}
                />
                <KeyHandler
                    keyEventName={KEYDOWN}
                    keyValue="W"
                    onKeyHandle={() => this.beginMapAutoPan(appStrings.MAP_PAN_DIRECTION_UP)}
                />

                <KeyHandler
                    keyEventName={KEYDOWN}
                    keyValue="s"
                    onKeyHandle={() => this.beginMapAutoPan(appStrings.MAP_PAN_DIRECTION_DOWN)}
                />
                <KeyHandler
                    keyEventName={KEYDOWN}
                    keyValue="S"
                    onKeyHandle={() => this.beginMapAutoPan(appStrings.MAP_PAN_DIRECTION_DOWN)}
                />

                <KeyHandler
                    keyEventName={KEYDOWN}
                    keyValue="a"
                    onKeyHandle={() => this.beginMapAutoPan(appStrings.MAP_PAN_DIRECTION_LEFT)}
                />
                <KeyHandler
                    keyEventName={KEYDOWN}
                    keyValue="A"
                    onKeyHandle={() => this.beginMapAutoPan(appStrings.MAP_PAN_DIRECTION_LEFT)}
                />

                <KeyHandler
                    keyEventName={KEYDOWN}
                    keyValue="d"
                    onKeyHandle={() => this.beginMapAutoPan(appStrings.MAP_PAN_DIRECTION_RIGHT)}
                />
                <KeyHandler
                    keyEventName={KEYDOWN}
                    keyValue="D"
                    onKeyHandle={() => this.beginMapAutoPan(appStrings.MAP_PAN_DIRECTION_RIGHT)}
                />

                <KeyHandler
                    keyEventName={KEYUP}
                    keyValue="w"
                    onKeyHandle={() => this.endMapAutoPan()}
                />
                <KeyHandler
                    keyEventName={KEYUP}
                    keyValue="W"
                    onKeyHandle={() => this.endMapAutoPan()}
                />

                <KeyHandler
                    keyEventName={KEYUP}
                    keyValue="s"
                    onKeyHandle={() => this.endMapAutoPan()}
                />
                <KeyHandler
                    keyEventName={KEYUP}
                    keyValue="S"
                    onKeyHandle={() => this.endMapAutoPan()}
                />

                <KeyHandler
                    keyEventName={KEYUP}
                    keyValue="a"
                    onKeyHandle={() => this.endMapAutoPan()}
                />
                <KeyHandler
                    keyEventName={KEYUP}
                    keyValue="A"
                    onKeyHandle={() => this.endMapAutoPan()}
                />

                <KeyHandler
                    keyEventName={KEYUP}
                    keyValue="d"
                    onKeyHandle={() => this.endMapAutoPan()}
                />
                <KeyHandler
                    keyEventName={KEYUP}
                    keyValue="D"
                    onKeyHandle={() => this.endMapAutoPan()}
                />
            </div>
        );
    }
}

KeyboardControlsContainer.propTypes = {
    maps: PropTypes.object.isRequired,
    mapActions: PropTypes.object.isRequired,
    dateSliderActions: PropTypes.object.isRequired,
    isDrawingEnabled: PropTypes.bool.isRequired,
    isMeasuringEnabled: PropTypes.bool.isRequired,
    dateSliderTimeResolution: PropTypes.object.isRequired,
    date: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        maps: state.map.get("maps"),
        date: state.map.get("date"),
        dateSliderTimeResolution: state.dateSlider.get("resolution"),
        isDrawingEnabled: state.map.getIn(["drawing", "isDrawingEnabled"]),
        isMeasuringEnabled: state.map.getIn(["measuring", "isMeasuringEnabled"])
    };
}

function mapDispatchToProps(dispatch) {
    return {
        mapActions: bindActionCreators(mapActions, dispatch),
        dateSliderActions: bindActionCreators(dateSliderActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(KeyboardControlsContainer);
