import Immutable from 'immutable';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { List, ListItem, ListSubHeader, ListCheckbox } from 'react-toolbox/lib/list';
import * as mapConfig from '_core/constants/mapConfig';
import * as mapStrings from '_core/constants/mapStrings';
import * as appActions from '_core/actions/AppActions';
import * as mapActions from '_core/actions/MapActions';
import * as layerActions from '_core/actions/LayerActions';
import * as dateSliderActions from '_core/actions/DateSliderActions';
import * as analyticsActions from '_core/actions/AnalyticsActions';
import MiscUtil from '_core/utils/MiscUtil';
import BaseMapDropdown from './BaseMapDropdown';
import MenuDropdown from '_core/components/Reusables/MenuDropdown';
import ModalMenuContainer from '_core/components/ModalMenu/ModalMenuContainer';

export class SettingsContainer extends Component {
    shouldComponentUpdate(nextProps) {
        return nextProps.settingsOpen || nextProps.settingsOpen !== this.props.settingsOpen;
    }
    setBasemap(layerId) {
        if(layerId && layerId !== "") {
            this.props.mapActions.setBasemap(layerId);
        } else {
            this.props.mapActions.hideBasemap();   
        }
    }
    render() {
        // sort and gather the basemaps into a set of dropdown options
        let activeBasemapId = "";
        let basemapList = this.props.basemaps.sort(MiscUtil.getImmutableObjectSort("title"));
        let basemapOptions = basemapList.reduce((acc, layer) => {
            if(layer.get("isActive")) {
                activeBasemapId = layer.get("id");
            }

            acc.push({
                value: layer.get("id"),
                label: layer.get("title"),
                thumbnailImage: layer.get("thumbnailImage")
            });
            return acc;
        }, []);
        basemapOptions.push({
            value: "",
            label: "None",
            thumbnailImage: ""
        });


        // check the reference and boundary layers
        let referenceLabelsLayer = this.props.referenceLayers.get(mapConfig.REFERENCE_LABELS_LAYER_ID);
        let politicalBoundariesLayer = this.props.referenceLayers.get(mapConfig.POLITICAL_BOUNDARIES_LAYER_ID);

        return (
            <ModalMenuContainer
                title="Settings"
                active={this.props.settingsOpen}
                closeFunc={this.props.appActions.closeSettings} >
                <List selectable ripple className="no-margin settings-content" >
                    <ListSubHeader className="list-sub-header" caption="Map Display" />
                    <BaseMapDropdown
                        auto
                        label="Base map selection"
                        selected="news"
                        className="list-item-dropdown"
                        source={basemapOptions}
                        value={activeBasemapId}
                        onChange={(value) => this.setBasemap(value)}
                    />
                    <MenuDropdown
                        auto
                        label="Scale units"
                        className="list-item-dropdown"
                        onChange={(value) => this.props.mapActions.setScaleUnits(value)}
                        source={mapConfig.SCALE_OPTIONS}
                        value={this.props.mapSettings.get("selectedScaleUnits")}
                    />
                    <MenuDropdown
                         auto
                         label="Terrain Exaggeration"
                         className="list-item-dropdown"
                         onChange={(value) => this.props.mapActions.setTerrainExaggeration(value)}
                         source={mapConfig.TERRAIN_EXAGGERATION_OPTIONS}
                         value={this.props.mapSettings.get("selectedTerrainExaggeration")}
                    />
                    <ListCheckbox
                        className="menu-check-box"
                        caption="Political Boundaries"
                        checked={politicalBoundariesLayer && politicalBoundariesLayer.get("isActive")}
                        legend="Display political boundaries on the map"
                        onChange={(value) => this.props.layerActions.setLayerActive(mapConfig.POLITICAL_BOUNDARIES_LAYER_ID, value)}
                    />
                    <ListCheckbox
                        className="menu-check-box"
                        caption="Place Labels"
                        checked={referenceLabelsLayer && referenceLabelsLayer.get("isActive")}
                        legend="Display place labels on the map"
                        onChange={(value) => this.props.layerActions.setLayerActive(mapConfig.REFERENCE_LABELS_LAYER_ID, value)}
                    />
                    <ListCheckbox
                        className="menu-check-box"
                        caption="Enable 3D Terrain"
                        checked={this.props.mapSettings.get("enableTerrain")}
                        legend="Enable terrain on the 3D map"
                        onChange={(value) => this.props.mapActions.setTerrainEnabled(value)}
                    />
                    <ListSubHeader className="list-sub-header" caption="Application Display" />
                    <ListCheckbox
                        className="menu-check-box"
                        caption="Collapsed Time Slider"
                        checked={this.props.sliderCollapsed}
                        legend="Collapse the time slider at the bottom of the screen"
                        onChange={(value) => this.props.dateSliderActions.setSliderCollapsed(value)}
                    />
                    <ListSubHeader className="list-sub-header" caption="Application Configuration" />
                    <ListCheckbox
                        className="menu-check-box"
                        caption="User Feedback Program"
                        checked={this.props.analyticsEnabled}
                        legend="Help us improve this tool by sending anonymous usage information"
                        onChange={(value) => this.props.analyticsActions.setAnalyticsEnabled(value)}
                    />
                    <ListCheckbox
                        className="menu-check-box"
                        caption="Auto-Update Url"
                        checked={this.props.autoUpdateUrlEnabled}
                        legend="Automatically update the url in this window to be shareable"
                        onChange={(value) => this.props.appActions.setAutoUpdateUrl(value)}
                    />
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
    sliderCollapsed: PropTypes.bool.isRequired,
    analyticsEnabled: PropTypes.bool.isRequired,
    autoUpdateUrlEnabled: PropTypes.bool.isRequired,
    basemaps: PropTypes.object.isRequired,
    referenceLayers: PropTypes.object.isRequired,
    mapSettings: PropTypes.object.isRequired,
    appActions: PropTypes.object.isRequired,
    mapActions: PropTypes.object.isRequired,
    layerActions: PropTypes.object.isRequired,
    dateSliderActions: PropTypes.object.isRequired,
    analyticsActions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        settingsOpen: state.settings.get("isOpen"),
        mapSettings: state.map.get("displaySettings"),
        basemaps: state.map.getIn(["layers", mapStrings.LAYER_GROUP_TYPE_BASEMAP]),
        referenceLayers: state.map.getIn(["layers", mapStrings.LAYER_GROUP_TYPE_REFERENCE]),
        sliderCollapsed: state.dateSlider.get("sliderCollapsed"),
        analyticsEnabled: state.analytics.get("isEnabled"),
        autoUpdateUrlEnabled: state.share.get("autoUpdateUrl")
    };
}

function mapDispatchToProps(dispatch) {
    return {
        appActions: bindActionCreators(appActions, dispatch),
        mapActions: bindActionCreators(mapActions, dispatch),
        layerActions: bindActionCreators(layerActions, dispatch),
        dateSliderActions: bindActionCreators(dateSliderActions, dispatch),
        analyticsActions: bindActionCreators(analyticsActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SettingsContainer);
