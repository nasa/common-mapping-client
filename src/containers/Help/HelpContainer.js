import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { List, ListItem, ListSubHeader, ListCheckbox, ListDivider } from 'react-toolbox/lib/list';
import * as actions from '../../actions/AppActions';
import ModalMenuContainer from '../ModalMenu/ModalMenuContainer';

export class HelpContainer extends Component {
    openLink(url) {
        window.open(url, "_blank");
    }
    mailTo(address) {
        window.location.href = "mailto:" + address;
    }
    render() {
        let helpPages = {
            about: {
                title: 'About'

            },
            "faq": {
                title: 'FAQ'
            }
        };
        return (
            <ModalMenuContainer
                small
                title={!this.props.helpPage ? "Help" : helpPages[this.props.helpPage].title}
                active={this.props.helpOpen}
                closeFunc={() => this.props.actions.closeHelp()}
                back={this.props.helpPage !== ""}
                backFunc={() => this.props.actions.selectHelpPage("")} >
                <List selectable ripple className={"no-margin help-list" + (!this.props.helpPage ? "" : " hidden")}>
                    <ListSubHeader caption="General" />
                    <ListItem
                        caption="About"
                        leftIcon="description"
                        onClick={() => this.props.actions.selectHelpPage("about")}
                    />
                    <ListItem
                        caption="FAQ"
                        leftIcon="description"
                        onClick={() => this.props.actions.selectHelpPage("faq")}
                    />
                    <ListItem
                        caption="Take a tour"
                        leftIcon="play_arrow"
                    />
                    <ListItem
                        caption="System Recommendation"
                        leftIcon="description"
                    />
                    <ListDivider />
                    <ListSubHeader caption="Get More Help" />
                    <ListItem
                        caption="Visit Help Forum"
                        leftIcon="link"
                        onClick={() => {this.openLink("http://google.com");}}
                    />
                    <ListItem
                        caption="Contact"
                        leftIcon="email"
                        onClick={() => {this.mailTo("test@test.test");}}
                    />
                </List>
                <div className={this.props.helpPage !== 'about' ? 'hidden' : 'help-page'}>
                    <br></br>
                    <h1>The common mapping client</h1>
                    <p>If you're reading this, you're most likely a developer.</p>
                    <p><i>Dear Developer – we hope this tool makes your life easier.</i></p>
                    <h2>More awesome stuff</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ultrices ullamcorper nisi nec pulvinar. Donec nibh libero, elementum in iaculis non, elementum a nulla. Fusce a sem mollis, consequat elit a, accumsan odio. Integer pellentesque sem orci. In at cursus nisl, at elementum ex. Aenean varius arcu velit, sed facilisis est tincidunt eget. Nam consectetur velit et gravida interdum. Nam imperdiet consectetur diam, ac ultricies diam scelerisque a. Phasellus lobortis eget lacus sed sagittis. Sed sagittis eu felis non blandit. Sed suscipit magna elit, sed tristique mauris pulvinar eget. Integer ut tempus velit. Maecenas tempus enim et orci laoreet ornare. Phasellus placerat eu ligula non tincidunt. Nullam nec efficitur sapien.</p>
                    <h3>Version 0.2</h3>
                </div>
                <div className={this.props.helpPage !== 'faq' ? 'hidden' : 'help-page'}>
                    <br></br>
                    <h1>Frequently asked questions</h1>
                    <ol>
                        <li>What is your name?</li>
                        <li>What is your quest?</li>
                        <li>What is your favorite colour?</li>
                    </ol>
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
