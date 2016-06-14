import Immutable from 'immutable';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as config from '../config/MainMenuConfig';
import { SCALE_OPTIONS } from '../config/mapConfig';
import * as appActions from '../actions/AppActions';
import * as mapActions from '../actions/MapActions';
import MiscUtil from '../utils/MiscUtil';
import BaseMapPreview from '../components/BaseMapPreview';
import MenuDropdown from '../components/MenuDropdown';
import MainMenuContentHeaderContainer from './MainMenuContentHeaderContainer';
import { List, ListItem, ListSubHeader, ListCheckbox } from 'react-toolbox/lib/list';
import {Button, IconButton} from 'react-toolbox/lib/button';
import Dialog from 'react-toolbox/lib/dialog';

export class SettingsContainer extends Component {
    render() {
        let dummyBasemap = Immutable.fromJS({
            title: "None",
            isActive: !this.props.basemaps.some((layer) => {
                return layer.get("isActive");
            }),
            thumbnailImage: ""
        });

        return (
            <Dialog className={"settingsContainer no-padding display-flex-col-wrapper"} 
                    active={this.props.settingsOpen} 
                    onEscKeyDown={this.props.appActions.closeSettings} 
                    onOverlayClick={this.props.appActions.closeSettings} 
                    title="Settings">
                <IconButton icon="close" neutral={false} onClick={this.props.appActions.closeSettings} className="settings-close"/>
                <List className="no-margin settings-content" selectable ripple>
                    <ListSubHeader className="list-sub-header" caption="Base Map Selection" />
                    <div id="baseMapPreviewContainer">
                        <div className="row top-xs base-map-preview-row">
                            {this.props.basemaps.map((layer) =>
                                <div className="col-xs-4" key={layer.get("id") + "_basemap_button"}>
                                    <BaseMapPreview layer={layer} onClick={() => this.props.mapActions.setBasemap(layer)} />
                                </div>
                            )}
                            <div className="col-xs-4">
                                <BaseMapPreview layer={dummyBasemap} onClick={() => this.props.mapActions.hideBasemap()} />
                            </div>
                        </div>
                    </div>
                    <ListSubHeader className="list-sub-header" caption="Map Scale Units" />
                    <MenuDropdown
                        auto
                        className="list-item-dropdown"
                        onChange={(value) => this.props.mapActions.setScaleUnits(value)}
                        source={SCALE_OPTIONS}
                        value={this.props.mapSettings.get("selectedScaleUnits")}
                    />
                    <ListSubHeader className="list-sub-header" caption="Display Configuration" />
                    <ListCheckbox
                        className="menu-check-box"
                        caption="Political Boundaries"
                        checked={this.props.mapSettings.get("displayPoliticalBoundaries")}
                        legend="Display political boundaries on the map"
                        onChange={() => this.props.mapActions.toggleDisplayPoliticalBoundaries()}
                    />
                    <ListCheckbox
                        className="menu-check-box"
                        caption="Place Labels"
                        checked={this.props.mapSettings.get("displayPlaceLabels")}
                        legend="Display place labels on the map"
                        onChange={() => this.props.mapActions.toggleDisplayPlaceLabels()}
                    />
                    <hr className="divider" />
                    <ListCheckbox
                        className="menu-check-box"
                        caption="Enable 3D Terrain"
                        checked={this.props.mapSettings.get("enableTerrain")}
                        legend="Enable terrain on the 3D map"
                        onChange={() => this.props.mapActions.toggleEnableTerrain()}
                    />
                    <hr className="divider" />
                    <ListItem
                        className="menu-check-box"
                        caption="Reset Application"
                        legend="Restore the application to its default state"
                        leftIcon="settings_backup_restore"
                    />
                </List>
            </Dialog>
        );
    }
}

SettingsContainer.propTypes = {
    settingsOpen: PropTypes.bool.isRequired,
    basemaps: PropTypes.object.isRequired,
    mapSettings: PropTypes.object.isRequired,
    appActions: PropTypes.object.isRequired,
    mapActions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        settingsOpen: state.settingsContainer.get("isOpen"),
        mapSettings: state.map.get("displaySettings"),
        basemaps: state.map.getIn(["layers", "basemap"])
    };
}

function mapDispatchToProps(dispatch) {
    return {
        appActions: bindActionCreators(appActions, dispatch),
        mapActions: bindActionCreators(mapActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SettingsContainer);
