import Immutable from 'immutable';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { List, ListItem, ListSubHeader, ListCheckbox } from 'react-toolbox/lib/list';
import { SCALE_OPTIONS, REFERENCE_LABELS_LAYER_ID, POLITICAL_BOUNDARIES_LAYER_ID } from '../../constants/mapConfig';
import * as appActions from '../../actions/AppActions';
import * as mapActions from '../../actions/MapActions';
import * as layerActions from '../../actions/LayerActions';
import * as dateSliderActions from '../../actions/DateSliderActions';
import MiscUtil from '../../utils/MiscUtil';
import BaseMapPreview from '../../components/BaseMapPreview';
import MenuDropdown from '../../components/MenuDropdown';
import ModalMenuContainer from '../ModalMenu/ModalMenuContainer';

export class SettingsContainer extends Component {
    render() {
        let dummyBasemap = Immutable.fromJS({
            title: "None",
            isActive: !this.props.basemaps.some((layer) => {
                return layer.get("isActive");
            }),
            thumbnailImage: ""
        });

        let basemapList = this.props.basemaps.sort(MiscUtil.getImmutableObjectSort("title"));


        let referenceLabelsLayer = this.props.referenceLayers.find((layer) => {
            return layer.get("id") === REFERENCE_LABELS_LAYER_ID;
        });
        let politicalBoundariesLayer = this.props.referenceLayers.find((layer) => {
            return layer.get("id") === POLITICAL_BOUNDARIES_LAYER_ID;
        });

        return (
            <ModalMenuContainer
                title="Settings"
                active={this.props.settingsOpen}
                closeFunc={this.props.appActions.closeSettings} >
                <List selectable ripple className="no-margin settings-content" >
                    <ListSubHeader className="list-sub-header" caption="Base Map Selection" />
                    <div id="baseMapPreviewContainer" className="text-wrap">
                            {basemapList.map((layer) =>
                                <BaseMapPreview
                                    layer={layer}
                                    onClick={() => this.props.mapActions.setBasemap(layer)}
                                    key={layer.get("id") + "_basemap_button"}
                                />
                            )}
                            <BaseMapPreview
                                layer={dummyBasemap}
                                onClick={() => this.props.mapActions.hideBasemap()}
                            />
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
                        checked={politicalBoundariesLayer && politicalBoundariesLayer.get("isActive")}
                        legend="Display political boundaries on the map"
                        onChange={(value) => this.props.layerActions.setLayerActive(POLITICAL_BOUNDARIES_LAYER_ID, value)}
                    />
                    <ListCheckbox
                        className="menu-check-box"
                        caption="Place Labels"
                        checked={referenceLabelsLayer && referenceLabelsLayer.get("isActive")}
                        legend="Display place labels on the map"
                        onChange={(value) => this.props.layerActions.setLayerActive(REFERENCE_LABELS_LAYER_ID, value)}
                    />
                    <hr className="divider" />
                    <ListCheckbox
                        className="menu-check-box"
                        caption="Enable 3D Terrain"
                        checked={this.props.mapSettings.get("enableTerrain")}
                        legend="Enable terrain on the 3D map"
                        onChange={(value) => this.props.mapActions.setTerrainEnabled(value)}
                    />
                    <hr className="divider" />
                    <ListCheckbox
                        className="menu-check-box"
                        caption="Collapsed Time Slider"
                        checked={this.props.sliderCollapsed}
                        legend="Collapse the time slider at the bottom of the screen"
                        onChange={(value) => this.props.dateSliderActions.setSliderCollapsed(value)}
                    />
                    <hr className="divider" />
                    <ListItem
                        className="menu-check-box"
                        caption="Reset Application"
                        legend="Restore the application to its default state"
                        leftIcon="settings_backup_restore"
                        onClick={this.props.appActions.resetApplicationState}
                    />
                </List>
            </ModalMenuContainer>
        );
    }
}

SettingsContainer.propTypes = {
    settingsOpen: PropTypes.bool.isRequired,
    basemaps: PropTypes.object.isRequired,
    referenceLayers: PropTypes.object.isRequired,
    mapSettings: PropTypes.object.isRequired,
    appActions: PropTypes.object.isRequired,
    mapActions: PropTypes.object.isRequired,
    layerActions: PropTypes.object.isRequired,
    dateSliderActions: PropTypes.object.isRequired,
    sliderCollapsed: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
    return {
        settingsOpen: state.settings.get("isOpen"),
        mapSettings: state.map.get("displaySettings"),
        basemaps: state.map.getIn(["layers", "basemap"]),
        referenceLayers: state.map.getIn(["layers", "reference"]),
        sliderCollapsed: state.dateSlider.get("sliderCollapsed")
    };
}

function mapDispatchToProps(dispatch) {
    return {
        appActions: bindActionCreators(appActions, dispatch),
        mapActions: bindActionCreators(mapActions, dispatch),
        layerActions: bindActionCreators(layerActions, dispatch),
        dateSliderActions: bindActionCreators(dateSliderActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SettingsContainer);
