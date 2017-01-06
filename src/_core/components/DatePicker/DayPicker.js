import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Autocomplete from 'react-toolbox/lib/autocomplete';
import * as appConfig from 'constants/appConfig';

export class DayPicker extends Component {
    render() {
        return (
            <div className="date-picker-selection col-xs-3">
                <Autocomplete
                    direction="up"
                    onChange={(value) => this.onUpdate(value)}
                    label=""
                    tabIndex="3"
                    multiple={false}
                    source={appConfig.DAY_ARRAY}
                    value={this.props.day}
                />
            </div>
        );
    }
}

DayPicker.propTypes = {
    onUpdate: PropTypes.func.isRequired,
    day: PropTypes.string.isRequired
};

export default connect()(DayPicker);
