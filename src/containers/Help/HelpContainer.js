import showdown from 'showdown';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { List, ListItem, ListSubHeader, ListCheckbox, ListDivider } from 'react-toolbox/lib/list';
import * as actions from '../../actions/AppActions';
import ModalMenuContainer from '../ModalMenu/ModalMenuContainer';
import MiscUtil from '../../utils/MiscUtil';

export class HelpContainer extends Component {
    componentWillMount() {
        this.pageKeys = {
            ABOUT: "about",
            FAQ: "faq",
            SYS_REQ: "systemReqs"
        };

        this.helpPageHeaders = {};
        this.helpPageHeaders[this.pageKeys.ABOUT] = 'About';
        this.helpPageHeaders[this.pageKeys.FAQ] = 'FAQ';
        this.helpPageHeaders[this.pageKeys.SYS_REQ] = 'System Requirements';

        // get makdown and parse it
        let cvt = new showdown.Converter();
        this.helpPageContent = {};
        this.helpPageContent[this.pageKeys.ABOUT] = cvt.makeHtml(require('../../default-data/help/about.md'));
        this.helpPageContent[this.pageKeys.FAQ] = cvt.makeHtml(require('../../default-data/help/faq.md'));
        this.helpPageContent[this.pageKeys.SYS_REQ] = cvt.makeHtml(require('../../default-data/help/systemReqs.md'));
    }

    render() {
        return (
            <ModalMenuContainer
                small
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
                        onClick={() => {MiscUtil.openLinkInNewTab("http://google.com");}}
                    />
                    <ListItem
                        caption="Contact"
                        leftIcon="email"
                        onClick={() => {MiscUtil.mailTo("test@test.test");}}
                    />
                </List>
                <div className={!this.props.helpPage ? 'hidden' : 'help-page'} dangerouslySetInnerHTML={{__html: this.helpPageContent[this.props.helpPage]}}></div>
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
