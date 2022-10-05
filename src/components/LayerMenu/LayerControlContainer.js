/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Checkbox from "@material-ui/core/Checkbox";
import Collapse from "@material-ui/core/Collapse";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import * as mapActions from "_core/actions/mapActions";
import * as mapActionsIfr from "actions/mapActions";
import MiscUtil from "_core/utils/MiscUtil";
import { LayerControlContainer as LayerControlContainerCore } from "_core/components/LayerMenu/LayerControlContainer.js";
import coreStyles from "_core/components/LayerMenu/LayerControlContainer.scss";
import displayStyles from "_core/styles/display.scss";
import { withStyles } from "@material-ui/core/styles";
import * as appStrings from "constants/appStrings";
import {
    FormControl,
    InputLabel,
    NativeSelect,
    Input,
    ListItemSecondaryAction
} from "@material-ui/core";

const muiStyles = theme => ({
    root: {
        display: "flex",
        flexWrap: "wrap"
    },
    formControl: {
        margin: "0 10px 10px 13px",
        width: "100%"
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2
    }
});

export class LayerControlContainer extends LayerControlContainerCore {
    shouldComponentUpdate(nextProps) {
        // Here we prevent unnecessary renderings by explicitly
        // ignoring certain pieces of the layer state. We do this
        // since LayerControlContainer is passed an entire layer object
        // when instantiated in LayerMenuContainer, which contains state
        // we want to ignore. By ignoring certain things, we can reduce
        // the number of unnecessary renderings.
        let nextLayer = nextProps.layer;
        let currLayer = this.props.layer;
        return (
            nextProps.palette !== this.props.palette ||
            nextLayer.get("title") !== currLayer.get("title") ||
            nextLayer.get("opacity") !== currLayer.get("opacity") ||
            nextLayer.get("isActive") !== currLayer.get("isActive") ||
            nextLayer.get("palette") !== currLayer.get("palette") ||
            nextLayer.get("min") !== currLayer.get("min") ||
            nextLayer.get("max") !== currLayer.get("max") ||
            nextLayer.get("units") !== currLayer.get("units") ||
            nextLayer.get("displayIndex") !== currLayer.get("displayIndex") ||
            nextLayer.getIn(["updateParameters", "filters"]) !==
                currLayer.getIn(["updateParameters", "filters"])
        );
    }

    changePalette(paletteId) {
        this.props.mapActionsIfr.setLayerPalette(this.props.layer, paletteId);
    }

    handleChangeSelect = key => event => {
        // get option palette id if exists
        const option =
            this.props.layer
                .getIn(["updateParameters", "filters", key, "list"])
                .find(option => option.get("code") === event.target.value) || undefined;
        this.props.mapActionsIfr.updateFilteredLayer(
            this.props.layer,
            key,
            event.target.value,
            option && option.get("palette")
        );
    };

    handleChangeCheckbox(parameter, value) {
        this.props.mapActionsIfr.updateFilteredLayer(this.props.layer, parameter, value);
    }

    renderCheckbox(key, parameter) {
        return (
            <ListItem key={key} dense classes={{ dense: coreStyles.dense }}>
                <ListItemText id={key} primary={parameter.get("label")} />
                <ListItemSecondaryAction>
                    <Checkbox
                        checked={parameter.get("value")}
                        onChange={(value, checked) => this.handleChangeCheckbox(key, !checked)}
                        onClick={evt => this.handleChangeCheckbox(key, evt.target.checked)}
                        value={key}
                        color="primary"
                    />
                </ListItemSecondaryAction>
            </ListItem>
        );
    }

    renderSelect(key, parameter) {
        return (
            <ListItem key={"select-item-" + key} dense classes={{ dense: coreStyles.dense }}>
                <ListItemText
                    id={key}
                    primary={
                        <FormControl className={this.props.classes.formControl}>
                            <InputLabel htmlFor="bind-native-helper">
                                {parameter.get("label")}
                            </InputLabel>
                            <NativeSelect
                                value={parameter.get("value")}
                                onChange={this.handleChangeSelect(key)}
                                input={<Input name="bind" id="bind-native-helper" />}
                            >
                                <option id="opt-default" value="">
                                    {""}
                                </option>
                                {parameter.get("list").map(item => {
                                    return (
                                        <option
                                            key={
                                                "opt-" +
                                                item.get("code") +
                                                "-" +
                                                item.get("palette")
                                            }
                                            value={item.get("code")}
                                            data-palette={item.get("palette")}
                                        >
                                            {item.get("label")}
                                        </option>
                                    );
                                })}
                            </NativeSelect>
                        </FormControl>
                    }
                />
            </ListItem>
        );
    }

    renderSlider(key, parameter) {
        // TODO
    }

    renderMiddleContent() {
        let parameterList = this.props.layer.getIn(["updateParameters", "filters"]);

        let collapseClasses = MiscUtil.generateStringFromSet({
            [[displayStyles.hidden]]: parameterList.size === 0,
            [coreStyles.layerControl]: true
        });

        return (
            <Collapse
                in={this.props.layer.get("isActive")}
                timeout="auto"
                className={collapseClasses}
                classes={{ entered: coreStyles.collapseEntered }}
            >
                <List dense>
                    {parameterList
                        .map((parameter, key) => {
                            const type = parameter.get("type");
                            switch (type) {
                                case appStrings.LAYER_URL_PARAMETER_CHECKBOX:
                                    return this.renderCheckbox(key, parameter);
                                case appStrings.LAYER_URL_PARAMETER_SELECT:
                                    return this.renderSelect(key, parameter);
                                default:
                                    console.warn(
                                        "Error in LayerControlContainer.renderMiddleContent: unknown layer facet type - ",
                                        type
                                    );
                                    break;
                            }
                        })
                        .toList()
                        .toJS()}
                </List>
            </Collapse>
        );
    }

    render() {
        let containerClasses = MiscUtil.generateStringFromSet({
            [this.props.className]: typeof this.props.className !== "undefined"
        });
        return (
            <div className={containerClasses}>
                {this.renderTopContent()}
                {this.renderMiddleContent()}
                {this.renderBottomContent()}
            </div>
        );
    }
}

LayerControlContainer.propTypes = {
    mapActions: PropTypes.object.isRequired,
    mapActionsIfr: PropTypes.object.isRequired,
    layer: PropTypes.object.isRequired,
    activeNum: PropTypes.number.isRequired,
    palette: PropTypes.object,
    palettes: PropTypes.object,
    className: PropTypes.string,
    classes: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        palettes: state.map.get("palettes")
    };
}

function mapDispatchToProps(dispatch) {
    return {
        mapActions: bindActionCreators(mapActions, dispatch),
        mapActionsIfr: bindActionCreators(mapActionsIfr, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(muiStyles)(LayerControlContainer));
