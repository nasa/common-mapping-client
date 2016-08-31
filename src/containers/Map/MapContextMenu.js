import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ContextMenu, MenuItem } from "react-contextmenu";
import { Button } from 'react-toolbox/lib/button';
import { ContextMenuSubMenu } from '../../components/ContextMenuSubMenu';
import * as actions from '../../actions/MapActions';
import * as appStrings from '../../constants/appStrings';

export class MapContextMenu extends Component {
    handleClick(data) {
        return false;
    }

    render() {
        return (
            <ContextMenu identifier={appStrings.MAP_CONTEXT_MENU}>
                <MenuItem data={{}} onClick={this.handleClick}>
                    <Button
                        accent
                        data-place="left"
                        onClick={() => console.log("HERERERE")}
                        className="context-menu-item" >
                        <i className="ms ms-measure-distance context-menu-icon"></i><span className="context-menu-label">Measure Distance</span>
                    </Button>
                </MenuItem>
                <MenuItem data={{}} onClick={this.handleClick}>
                    <Button
                        accent
                        data-place="left"
                        label="Drop Marker"
                        icon="pin_drop"
                        onClick={() => console.log("HERERERE")}
                        className="context-menu-item" />
                </MenuItem>
                <ContextMenuSubMenu title="Draw Shape">
                    <MenuItem data={{}} onClick={this.handleClick}>
                        <Button
                            accent
                            data-place="left"
                            label="Circle"
                            icon="radio_button_unchecked"
                            onClick={() => console.log("HERERERE")}
                            className="context-menu-item" />
                    </MenuItem>
                    <MenuItem data={{}} onClick={this.handleClick}>
                        <Button
                            accent
                            data-place="left"
                            onClick={() => console.log("HERERERE")}
                            className="context-menu-item" >
                            <i className="ms ms-line context-menu-icon"></i><span className="context-menu-label">Polyline</span>
                        </Button>
                    </MenuItem>
                    <MenuItem data={{}} onClick={this.handleClick}>
                        <Button
                            accent
                            data-place="left"
                            onClick={() => console.log("HERERERE")}
                            className="context-menu-item" >
                            <i className="ms ms-polygon context-menu-icon"></i><span className="context-menu-label">Polygon</span>
                        </Button>
                    </MenuItem>
                    <hr className="divider medium-light" />
                    <MenuItem data={{}} onClick={this.handleClick}>
                        <Button
                            accent
                            data-place="left"
                            label="Clear Drawings"
                            icon="delete"
                            onClick={() => console.log("HERERERE")}
                            className="context-menu-item" />
                    </MenuItem>
                </ContextMenuSubMenu>
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
