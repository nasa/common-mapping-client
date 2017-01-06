import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Autocomplete from 'react-toolbox/lib/autocomplete';
import * as appConfig from 'constants/appConfig';

export class MonthPicker extends Component {
    render() {
        return (
            <div className="date-picker-selection col-xs-4">
                <Autocomplete
                    direction="up"
                    onChange={(value) => this.props.onUpdate(value)}
                    label=""
                    tabIndex="2"
                    multiple={false}
                    source={appConfig.MONTH_ARRAY}
                    value={this.props.month}
                />
            </div>
        );
    }
}

MonthPicker.propTypes = {
    onUpdate: PropTypes.func.isRequired,
    month: PropTypes.string.isRequired
};

export default connect()(MonthPicker);
