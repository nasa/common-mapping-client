import React, { Component } from 'react';
import { connect } from 'react-redux';
import CoreAppContainer from '../../_core/components/App/CoreAppContainer';
import '../../styles/styles.scss';

export class AppContainer extends Component {
    render() {
        return (
            <CoreAppContainer />
        );
    }
}

export default connect()(AppContainer);
