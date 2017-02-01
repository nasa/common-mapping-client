import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import * as mapActions from '_core/actions/MapActions';
import * as dateSliderActions from '_core/actions/DateSliderActions';
import appConfig from 'constants/appConfig';
import * as appStrings from '_core/constants/appStrings';
import KeyHandler, { KEYUP, KEYDOWN } from 'react-key-handler';

const SPEED_FAST = 100; 
const SPEED_SLOW = 500;

export class KeyboardControlsContainer extends Component {
    componentDidMount() {
        // Instance variables are used here since these variables are purely interaction
        // based and are never intended to be affected by application state or affect application state.
        this.autoIncrementInterval = null;
        this.shouldAutoIncrement = false;
        this.autoIncrementSpeed = SPEED_SLOW;
        this.autoIncrementResolution = "days";
        this.shouldIntervalIncrement = true;
        this.autoIncrementEnabled = true;
    }
    shouldComponentUpdate(nextProps){
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
    autoIncrement() {
        if(this.shouldAutoIncrement) {
            clearTimeout(this.autoIncrementInterval);
            this.incrementDate(this.autoIncrementResolution, this.shouldIntervalIncrement);
            this.autoIncrementInterval = setTimeout(() => this.autoIncrement(), this.autoIncrementSpeed);
        }
    }
    beginAutoIncrement(increment) {
        if(this.autoIncrementEnabled) {
            this.shouldAutoIncrement = true;
            this.shouldIntervalIncrement = increment;
            if(this.autoIncrementInterval === null) {
                this.autoIncrementInterval = setTimeout(() => this.autoIncrement(), this.autoIncrementSpeed);
                this.incrementDate(this.autoIncrementResolution, this.shouldIntervalIncrement);
            }
        }
    }
    endAutoIncrement() {
        clearTimeout(this.autoIncrementInterval);
        this.shouldAutoIncrement = false;
        this.autoIncrementInterval = null;
    }
    setAutoIncrementResolution(resolution) {
        this.autoIncrementResolution = resolution;
    }
    setAutoIncrementSpeed(speed) {
        this.autoIncrementSpeed = speed;
    }
    disableAutoIncrement() {
        this.autoIncrementEnabled = false;
        this.endAutoIncrement();
    }
    enableAutoIncrement() {
        this.autoIncrementEnabled = true;
    }
    adjustDateSliderTimeResolution(up) {
        if(up) {
            if(this.props.dateSliderTimeResolution.get("label") === appConfig.DATE_SLIDER_RESOLUTIONS.YEARS.label) {
                this.props.dateSliderActions.setDateResolution(appConfig.DATE_SLIDER_RESOLUTIONS.MONTHS);
            } else {
                this.props.dateSliderActions.setDateResolution(appConfig.DATE_SLIDER_RESOLUTIONS.DAYS);
            }
        } else {
            if(this.props.dateSliderTimeResolution.get("label") === appConfig.DATE_SLIDER_RESOLUTIONS.DAYS.label) {
                this.props.dateSliderActions.setDateResolution(appConfig.DATE_SLIDER_RESOLUTIONS.MONTHS);
            } else {
                this.props.dateSliderActions.setDateResolution(appConfig.DATE_SLIDER_RESOLUTIONS.YEARS);
            }
        }
    }
    handleKeyDown_ArrowUp() {
        // Key conflicts: Timeline resolution and layer menu opacity slider
        let focusEl = document.activeElement.getAttribute("data-react-toolbox");
        // If we're focused on slider, do not adjust timeline
        if (focusEl !== "slider") {
            this.adjustDateSliderTimeResolution(true);
        }
    }
    handleKeyDown_ArrowDown() {
        // Key conflicts: Timeline resolution and layer menu opacity slider
        let focusEl = document.activeElement.getAttribute("data-react-toolbox");
        // If we're focused on slider, do not adjust timeline
        if (focusEl !== "slider") {
            this.adjustDateSliderTimeResolution(false);
        }
    }
    render() {
        return (
            <div className="hidden">
                <KeyHandler keyEventName={KEYUP} keyValue="Escape" onKeyHandle={(evt) => this.handleKeyUp_Escape()} />

                <KeyHandler keyEventName={KEYUP} keyValue="Enter" onKeyHandle={(evt) => this.handleKeyUp_Enter()} />

                <KeyHandler keyEventName={KEYDOWN} keyValue="Meta" onKeyHandle={() => this.disableAutoIncrement()} />
                <KeyHandler keyEventName={KEYUP} keyValue="Meta" onKeyHandle={() => this.enableAutoIncrement()} />

                <KeyHandler keyEventName={KEYDOWN} keyValue="ArrowLeft" onKeyHandle={() => this.beginAutoIncrement(false)} />
                <KeyHandler keyEventName={KEYUP} keyValue="ArrowLeft" onKeyHandle={() => this.endAutoIncrement()} />

                <KeyHandler keyEventName={KEYDOWN} keyValue="ArrowRight" onKeyHandle={() => this.beginAutoIncrement(true)} />
                <KeyHandler keyEventName={KEYUP} keyValue="ArrowRight" onKeyHandle={() => this.endAutoIncrement()} />

                <KeyHandler keyEventName={KEYUP} keyValue="ArrowUp" onKeyHandle={() => this.handleKeyDown_ArrowUp()} />
                <KeyHandler keyEventName={KEYUP} keyValue="ArrowDown" onKeyHandle={() => this.handleKeyDown_ArrowDown()} />

                <KeyHandler keyEventName={KEYDOWN} keyValue="x" onKeyHandle={() => this.setAutoIncrementResolution("months")} />
                <KeyHandler keyEventName={KEYUP} keyValue="x" onKeyHandle={() => this.setAutoIncrementResolution("days")} />

                <KeyHandler keyEventName={KEYDOWN} keyValue="z" onKeyHandle={() => this.setAutoIncrementSpeed(SPEED_FAST)} />
                <KeyHandler keyEventName={KEYUP} keyValue="z" onKeyHandle={() => this.setAutoIncrementSpeed(SPEED_SLOW)} />

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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(KeyboardControlsContainer);
