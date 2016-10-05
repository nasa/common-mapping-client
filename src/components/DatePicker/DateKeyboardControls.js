import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import * as actions from '../../actions/MapActions';
import * as appConfig from '../../constants/appConfig';
import KeyHandler, { KEYUP, KEYDOWN } from 'react-key-handler';

const SPEED_FAST = 100;
const SPEED_SLOW = 500;

export class DateKeyboardControls extends Component {
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
            this.props.actions.setDate(newDate.toDate());
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
    render() {
        return (
            <div id="dateKeyboardControls" className="hidden">
                <KeyHandler keyEventName={KEYDOWN} keyValue="Meta" onKeyHandle={() => this.disableAutoIncrement()} />
                <KeyHandler keyEventName={KEYUP} keyValue="Meta" onKeyHandle={() => this.enableAutoIncrement()} />

                <KeyHandler keyEventName={KEYDOWN} keyValue="ArrowLeft" onKeyHandle={() => this.beginAutoIncrement(false)} />
                <KeyHandler keyEventName={KEYUP} keyValue="ArrowLeft" onKeyHandle={() => this.endAutoIncrement()} />

                <KeyHandler keyEventName={KEYDOWN} keyValue="ArrowRight" onKeyHandle={() => this.beginAutoIncrement(true)} />
                <KeyHandler keyEventName={KEYUP} keyValue="ArrowRight" onKeyHandle={() => this.endAutoIncrement()} />

                <KeyHandler keyEventName={KEYDOWN} keyValue="x" onKeyHandle={() => this.setAutoIncrementResolution("months")} />
                <KeyHandler keyEventName={KEYUP} keyValue="x" onKeyHandle={() => this.setAutoIncrementResolution("days")} />

                <KeyHandler keyEventName={KEYDOWN} keyValue="z" onKeyHandle={() => this.setAutoIncrementSpeed(SPEED_FAST)} />
                <KeyHandler keyEventName={KEYUP} keyValue="z" onKeyHandle={() => this.setAutoIncrementSpeed(SPEED_SLOW)} />
            </div>
        );
    }
}

DateKeyboardControls.propTypes = {
    actions: PropTypes.object.isRequired,
    date: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        date: state.map.get("date")
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DateKeyboardControls);
