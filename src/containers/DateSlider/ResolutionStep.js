import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button } from 'react-toolbox/lib/button';
import KeyHandler, { KEYPRESS, KEYUP } from 'react-key-handler';
import * as appStrings from '../../constants/appStrings';
import * as DateSliderActions from '../../actions/DateSliderActions';
import MiscUtil from '../../utils/MiscUtil';
import MenuDropdown from '../../components/MenuDropdown';

export class ResolutionStep extends Component {
    // <Button
    //     neutral
    //     // inverse
    //     label={appStrings.DATE_SLIDER_RESOLUTIONS.DAYS}
    //     className="no-padding resolution-step small"
    //     onClick={() => this.props.actions.setDateResolution(appStrings.DATE_SLIDER_RESOLUTIONS.DAYS)}
    // />
    // <Button
    //     neutral
    //     // inverse
    //     label={appStrings.DATE_SLIDER_RESOLUTIONS.MONTHS}
    //     className="no-padding resolution-step small"
    //     onClick={() => this.props.actions.setDateResolution(appStrings.DATE_SLIDER_RESOLUTIONS.MONTHS)}
    // />
    // <Button
    //     neutral
    //     // inverse
    //     label={appStrings.DATE_SLIDER_RESOLUTIONS.YEARS}
    //     className="no-padding resolution-step small"
    //     onClick={() => this.props.actions.setDateResolution(appStrings.DATE_SLIDER_RESOLUTIONS.YEARS)}
    // />
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
                <KeyHandler keyEventName={KEYUP} keyValue="ArrowUp" onKeyHandle={(evt) => {this.handleIncremendClick(true);}} />
                <KeyHandler keyEventName={KEYUP} keyValue="ArrowDown" onKeyHandle={(evt) => {this.handleIncremendClick(false);}} />
                <div className="resolution-picker-selection-increment">
                    <Button neutral accent icon="arrow_drop_up" className="no-padding" onClick={() => this.handleIncremendClick(true)}/>
                </div>
                <MenuDropdown
                    auto
                    className="list-item-dropdown small"
                    onChange={(value) => this.props.actions.setDateResolution(value)}
                    source={options}
                    value={this.props.resolution}
                />
                <div className="resolution-picker-selection-increment">
                    <Button neutral accent icon="arrow_drop_down" className="no-padding" onClick={() => this.handleIncremendClick(false)}/>
                </div>
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
