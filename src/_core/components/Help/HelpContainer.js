import showdown from 'showdown';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { List, ListItem, ListSubHeader, ListCheckbox, ListDivider } from 'react-toolbox/lib/list';
import * as actions from '_core/actions/AppActions';
import * as appConfig from 'constants/appConfig';
import ModalMenuContainer from '_core/components/ModalMenu/ModalMenuContainer';
import MiscUtil from '_core/utils/MiscUtil';

const miscUtil = new MiscUtil();
showdown.setFlavor('github');

export class HelpContainer extends Component {
    componentWillMount() {
        // TODO - move these to a config or something
        this.pageKeys = {
            ABOUT: "about",
            FAQ: "faq",
            SYS_REQ: "systemReqs"
        };

        this.helpPageHeaders = {};
        this.helpPageHeaders[this.pageKeys.ABOUT] = 'About';
        this.helpPageHeaders[this.pageKeys.FAQ] = 'FAQ';
        this.helpPageHeaders[this.pageKeys.SYS_REQ] = 'System Requirements';

        // get markdown and parse it
        let cvt = new showdown.Converter();
        this.helpPageContent = {};
        this.helpPageContent[this.pageKeys.ABOUT] = cvt.makeHtml(require('default-data/help/about.md'));
        this.helpPageContent[this.pageKeys.FAQ] = cvt.makeHtml(require('default-data/help/faq.md'));
        this.helpPageContent[this.pageKeys.SYS_REQ] = cvt.makeHtml(require('default-data/help/systemReqs.md'));
    }

    render() {
        return (
            <ModalMenuContainer
                small={this.props.helpPage === ""}
                className="no-background"
                title={!this.props.helpPage ? "Help" : this.helpPageHeaders[this.props.helpPage]}
                active={this.props.helpOpen}
                closeFunc={() => this.props.actions.closeHelp()}
                back={this.props.helpPage !== ""}
                backFunc={() => this.props.actions.selectHelpPage("")} >
                <List selectable ripple className={"no-margin help-list" + (!this.props.helpPage ? "" : " hidden")}>
                    <ListSubHeader caption="General" />
                    <ListItem
                        caption="About"
                        leftIcon="description"
                        onClick={() => this.props.actions.selectHelpPage(this.pageKeys.ABOUT)}
                    />
                    <ListItem
                        caption="FAQ"
                        leftIcon="description"
                        onClick={() => this.props.actions.selectHelpPage(this.pageKeys.FAQ)}
                    />
                    <ListItem
                        caption="Take a tour"
                        leftIcon="play_arrow"
                    />
                    <ListItem
                        caption="System Recommendation"
                        leftIcon="description"
                        onClick={() => this.props.actions.selectHelpPage(this.pageKeys.SYS_REQ)}
                    />
                    <ListDivider />
                    <ListSubHeader caption="Get More Help" />
                    <ListItem
                        caption="Visit Help Forum"
                        leftIcon="link"
                        onClick={() => {miscUtil.openLinkInNewTab("http://google.com");}}
                    />
                    <ListItem
                        caption="Contact"
                        leftIcon="email"
                        onClick={() => {miscUtil.mailTo("test@test.test");}}
                    />
                </List>
                <div className={!this.props.helpPage ? 'hidden' : 'help-page'} 
                     // eslint-disable-next-line react/no-danger
                     dangerouslySetInnerHTML={{__html: this.helpPageContent[this.props.helpPage]}} 
                />
                <div id="helpVersionTagContainer" className={this.props.helpPage ? 'hidden': ''} >
                    <h4 className="version-tag">Version: {appConfig.APP_VERSION}</h4>
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HelpContainer);
