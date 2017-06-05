import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SingleDate from '_core/components/DateSlider/SingleDate';
import MiscUtil from '_core/utils/MiscUtil';

const miscUtil = new MiscUtil();

export class CurrentDate extends Component {
    render() {
        return (
            <SingleDate
                active={this.props.active}
                date={this.props.date}
                isDragging={this.props.isDragging}
                beforeDrag={this.props.beforeDrag}
                onDrag={this.props.onDrag}
                afterDrag={this.props.afterDrag}
                getDateFromX={this.props.getDateFromX}
                getXFromDate={this.props.getXFromDate}
                maxX={this.props.maxX}
                minX={this.props.minX}
            />
        );
    }
}
CurrentDate.propTypes = {
    active: PropTypes.bool.isRequired,
    date: PropTypes.object.isRequired,
    getDateFromX: PropTypes.func.isRequired,
    getXFromDate: PropTypes.func.isRequired,
    isDragging: PropTypes.bool,
    onDrag: PropTypes.func,
    beforeDrag: PropTypes.func,
    afterDrag: PropTypes.func,
    maxX: PropTypes.number,
    minX: PropTypes.number,
};

function mapStateToProps(state) {
    return {
        date: state.map.get("date"),
        isDragging: state.dateSlider.get("isDragging")
    };
}

export default connect(
    mapStateToProps,
    null
)(CurrentDate);
