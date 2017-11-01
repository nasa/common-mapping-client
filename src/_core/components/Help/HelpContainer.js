import showdown from "showdown";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
    List,
    ListItem,
    ListSubHeader,
    ListDivider
} from "react-toolbox/lib/list";
import * as actions from "_core/actions/AppActions";
import appConfig from "constants/appConfig";
import ModalMenuContainer from "_core/components/ModalMenu/ModalMenuContainer";
import MiscUtil from "_core/utils/MiscUtil";

export class HelpContainer extends Component {
    constructor(props) {
        super(props);

        // set up our markdown converter
        let cvt = new showdown.Converter();
        cvt.setFlavor("github");

        // set up our pages config
        this.helpPageConfig = {
            ABOUT: {
                key: "ABOUT",
                label: "About",
                content: cvt.makeHtml(
                    require("default-data/_core_default-data/help/about.md")
                )
            },
            FAQ: {
                key: "FAQ",
                label: "FAQ",
                content: cvt.makeHtml(
                    require("default-data/_core_default-data/help/faq.md")
                )
            },
            SYS_REQ: {
                key: "SYS_REQ",
                label: "System Requirements",
                content: cvt.makeHtml(
                    require("default-data/_core_default-data/help/systemReqs.md")
                )
            }
        };
    }

    render() {
        let pageContent = this.props.helpPage
            ? this.helpPageConfig[this.props.helpPage].content
            : "";
        return (
            <ModalMenuContainer
                small={this.props.helpPage === ""}
                className="no-background"
                title={
                    !this.props.helpPage ? (
                        "Help"
                    ) : (
                        this.helpPageConfig[this.props.helpPage].label
                    )
                }
                active={this.props.helpOpen}
                closeFunc={() => this.props.actions.setHelpOpen(false)}
                back={this.props.helpPage !== ""}
                backFunc={() => this.props.actions.selectHelpPage("")}
            >
                <List
                    selectable
                    ripple
                    className={
                        "no-margin help-list" +
                        (!this.props.helpPage ? "" : " hidden")
                    }
                >
                    <ListSubHeader caption="General" />
                    <ListItem
                        caption={this.helpPageConfig.ABOUT.label}
                        leftIcon="description"
                        onClick={() =>
                            this.props.actions.selectHelpPage(
                                this.helpPageConfig.ABOUT.key
                            )}
                    />
                    <ListItem
                        caption={this.helpPageConfig.FAQ.label}
                        leftIcon="description"
                        onClick={() =>
                            this.props.actions.selectHelpPage(
                                this.helpPageConfig.FAQ.key
                            )}
                    />
                    <ListItem
                        caption={this.helpPageConfig.SYS_REQ.label}
                        leftIcon="description"
                        onClick={() =>
                            this.props.actions.selectHelpPage(
                                this.helpPageConfig.SYS_REQ.key
                            )}
                    />
                    <ListItem caption="Take a tour" leftIcon="play_arrow" />
                    <ListDivider />
                    <ListSubHeader caption="Get More Help" />
                    <ListItem
                        caption="Visit Help Forum"
                        leftIcon="link"
                        onClick={() => {
                            MiscUtil.openLinkInNewTab("http://google.com");
                        }}
                    />
                    <ListItem
                        caption="Contact"
                        leftIcon="email"
                        onClick={() => {
                            MiscUtil.mailTo("test@test.test");
                        }}
                    />
                </List>
                <div
                    className={!this.props.helpPage ? "hidden" : "help-page"}
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: pageContent }}
                />
                <div
                    id="helpVersionTagContainer"
                    className={this.props.helpPage ? "hidden" : ""}
                >
                    <h4 className="version-tag">
                        Version: {appConfig.APP_VERSION}
                    </h4>
                </div>
            </ModalMenuContainer>
        );
    }
}

HelpContainer.propTypes = {
    actions: PropTypes.object.isRequired,
    helpOpen: PropTypes.bool.isRequired,
    helpPage: PropTypes.string.isRequired
};

function mapStateToProps(state) {
    return {
        helpOpen: state.help.get("isOpen"),
        helpPage: state.help.get("helpPage")
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(HelpContainer);
