import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Autocomplete from 'react-toolbox/lib/autocomplete';
import * as appConfig from 'constants/appConfig';

export class YearPicker extends Component {
    render() {
        return (
            <div className="date-picker-selection col-xs-5">
                <Autocomplete
                    direction="up"
                    onChange={(value) => this.props.onUpdate(value)}
                    label=""
                    tabIndex="1"
                    multiple={false}
                    source={appConfig.YEAR_ARRAY}
                    value={this.props.year}
                />
            </div>
        );
    }
}

YearPicker.propTypes = {
    onUpdate: PropTypes.func.isRequired,
    year: PropTypes.string.isRequired
};

export default connect()(YearPicker);
