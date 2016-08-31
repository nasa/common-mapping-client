import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ContextMenu, MenuItem } from "react-contextmenu";
import Button from 'react-toolbox/lib/button';
import * as actions from '../../actions/MapActions';
import * as appStrings from '../../constants/appStrings';

export class MapContextMenu extends Component {
    handleClick(data) {
        console.log(data);
    }

    render() {
        return (
            <ContextMenu identifier={appStrings.MAP_CONTEXT_MENU}>
                <MenuItem data={{key: "some_data"}} onClick={this.handleClick}>
                    ContextMenu Item 1
                </MenuItem>
                <MenuItem data={{key: "some_data"}} onClick={this.handleClick}>
                    ContextMenu Item 2
                </MenuItem>
                <MenuItem data={{key: "some_data"}} onClick={this.handleClick}>
                    ContextMenu Item 3
                </MenuItem>
            </ContextMenu>
        );
    }
}

MapContextMenu.propTypes = {
    in3DMode: PropTypes.bool.isRequired,
    drawing: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        in3DMode: state.map.getIn(["view", "in3DMode"]),
        drawing: state.map.get("drawing")
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
)(MapContextMenu);
