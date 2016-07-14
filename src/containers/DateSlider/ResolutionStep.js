import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import KeyHandler, { KEYPRESS, KEYUP } from 'react-key-handler';
import * as appStrings from '../../constants/appStrings';
import * as DateSliderActions from '../../actions/DateSliderActions';
import MiscUtil from '../../utils/MiscUtil';
import MenuDropdown from '../../components/MenuDropdown';

export class ResolutionStep extends Component {
    handleIncremendClick(up) {
        if(up) {
            if(this.props.resolution === appStrings.DATE_SLIDER_RESOLUTIONS.YEARS) {
                this.props.actions.setDateResolution(appStrings.DATE_SLIDER_RESOLUTIONS.MONTHS);
            } else {
                this.props.actions.setDateResolution(appStrings.DATE_SLIDER_RESOLUTIONS.DAYS);
            }
        } else {
            if(this.props.resolution === appStrings.DATE_SLIDER_RESOLUTIONS.DAYS) {
                this.props.actions.setDateResolution(appStrings.DATE_SLIDER_RESOLUTIONS.MONTHS);
            } else {
                this.props.actions.setDateResolution(appStrings.DATE_SLIDER_RESOLUTIONS.YEARS);
            }
        }
    }
    render() {
        let options = [{ value: appStrings.DATE_SLIDER_RESOLUTIONS.DAYS, label: appStrings.DATE_SLIDER_RESOLUTIONS.DAYS, abbrev: '' },
            { value: appStrings.DATE_SLIDER_RESOLUTIONS.MONTHS, label: appStrings.DATE_SLIDER_RESOLUTIONS.MONTHS, abbrev: '' },
            { value: appStrings.DATE_SLIDER_RESOLUTIONS.YEARS, label: appStrings.DATE_SLIDER_RESOLUTIONS.YEARS, abbrev: '' }
        ];
        let selected = appStrings.DATE_SLIDER_RESOLUTIONS.DAYS;
        return (
            <div id="dateSliderResolutionStepContainer" className="text-wrap">
                <KeyHandler keyEventName={KEYUP} keyValue="ArrowUp" onKeyHandle={(evt) => {evt.altKey ? this.handleIncremendClick(true) : false;}} />
                <KeyHandler keyEventName={KEYUP} keyValue="ArrowDown" onKeyHandle={(evt) => {evt.altKey ? this.handleIncremendClick(false) : false;}} />
                <MenuDropdown
                    auto
                    className="list-item-dropdown small resolution-picker"
                    onChange={(value) => this.props.actions.setDateResolution(value)}
                    source={options}
                    value={this.props.resolution}
                />
            </div>
        );
    }
}
ResolutionStep.propTypes = {
    resolution: PropTypes.string.isRequired,
    actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        resolution: state.dateSlider.get("resolution")
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(DateSliderActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ResolutionStep);
