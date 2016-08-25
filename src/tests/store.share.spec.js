import * as AppActions from '../actions/AppActions';
import { createStore } from 'redux';
import { expect } from 'chai';
import rootReducer from '../reducers';
import { mapState, layerModel, paletteModel } from '../reducers/models/map';
import { asyncState } from '../reducers/models/async';
import { helpState } from '../reducers/models/help';
import { shareState } from '../reducers/models/share';
import { settingsState } from '../reducers/models/settings';
import { dateSliderState } from '../reducers/models/dateSlider';
import { analyticsState } from '../reducers/models/analytics';
import { viewState } from '../reducers/models/view';
import { layerInfoState } from '../reducers/models/layerInfo';

const initialState = {
    map: mapState,
    view: viewState,
    asyncronous: asyncState,
    help: helpState,
    settings: settingsState,
    share: shareState,
    dateSlider: dateSliderState,
    analytics: analyticsState,
    layerInfo: layerInfoState
};

describe('Store - Share', function() {
    it('enables auto update url', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            AppActions.setAutoUpdateUrl(true)
        ];

        actions.forEach(action => store.dispatch(action));

        const actual = store.getState();

        const expected = {
            map: mapState.remove("maps"),
            layerInfo: layerInfoState,
            help: helpState,
            view: viewState,
            asyncronous: asyncState,
            settings: settingsState,
            share: shareState.set("autoUpdateUrl", true),
            analytics: analyticsState,
            dateSlider: dateSliderState
        };

        // CHANGE
        expect(actual.share.toJS()).to.deep.equal(expected.share.toJS());

        // NO CHANGE
        expect(actual.map.remove("maps").toJS()).to.deep.equal(expected.map.toJS());
        expect(actual.layerInfo.toJS()).to.deep.equal(expected.layerInfo.toJS());
        expect(actual.help.toJS()).to.deep.equal(expected.help.toJS());
        expect(actual.view.toJS()).to.deep.equal(expected.view.toJS());
        expect(actual.asyncronous.toJS()).to.deep.equal(expected.asyncronous.toJS());
        expect(actual.settings.toJS()).to.deep.equal(expected.settings.toJS());
        expect(actual.dateSlider.toJS()).to.deep.equal(expected.dateSlider.toJS());
        expect(actual.analytics.toJS()).to.deep.equal(expected.analytics.toJS());
    });

    it('disables auto update url', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            AppActions.setAutoUpdateUrl(false)
        ];

        actions.forEach(action => store.dispatch(action));

        const actual = store.getState();
        const expected = {
            map: mapState.remove("maps"),
            layerInfo: layerInfoState,
            help: helpState,
            view: viewState,
            asyncronous: asyncState,
            settings: settingsState,
            share: shareState.set("autoUpdateUrl", false),
            analytics: analyticsState,
            dateSlider: dateSliderState
        };
        // CHANGE
        expect(actual.share.toJS()).to.deep.equal(expected.share.toJS());

        // NO CHANGE
        expect(actual.map.remove("maps").toJS()).to.deep.equal(expected.map.toJS());
        expect(actual.layerInfo.toJS()).to.deep.equal(expected.layerInfo.toJS());
        expect(actual.help.toJS()).to.deep.equal(expected.help.toJS());
        expect(actual.view.toJS()).to.deep.equal(expected.view.toJS());
        expect(actual.asyncronous.toJS()).to.deep.equal(expected.asyncronous.toJS());
        expect(actual.settings.toJS()).to.deep.equal(expected.settings.toJS());
        expect(actual.dateSlider.toJS()).to.deep.equal(expected.dateSlider.toJS());
        expect(actual.analytics.toJS()).to.deep.equal(expected.analytics.toJS());
    });
    it('can open the share container.', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            AppActions.openShare()
        ];

        actions.forEach(action => store.dispatch(action));

        const actual = store.getState();
        const expected = {
            map: mapState.remove("maps"),
            layerInfo: layerInfoState,
            help: helpState,
            view: viewState,
            asyncronous: asyncState,
            settings: settingsState,
            share: shareState.set("isOpen", true),
            analytics: analyticsState,
            dateSlider: dateSliderState
        };

        // CHANGE
        expect(actual.share.toJS()).to.deep.equal(expected.share.toJS());

        // NO CHANGE
        expect(actual.map.remove("maps").toJS()).to.deep.equal(expected.map.toJS());
        expect(actual.layerInfo.toJS()).to.deep.equal(expected.layerInfo.toJS());
        expect(actual.help.toJS()).to.deep.equal(expected.help.toJS());
        expect(actual.view.toJS()).to.deep.equal(expected.view.toJS());
        expect(actual.asyncronous.toJS()).to.deep.equal(expected.asyncronous.toJS());
        expect(actual.settings.toJS()).to.deep.equal(expected.settings.toJS());
        expect(actual.dateSlider.toJS()).to.deep.equal(expected.dateSlider.toJS());
        expect(actual.analytics.toJS()).to.deep.equal(expected.analytics.toJS());
    });
    it('can close the share container.', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            AppActions.closeShare()
        ];

        actions.forEach(action => store.dispatch(action));

        const actual = store.getState();
        const expected = {
            map: mapState.remove("maps"),
            layerInfo: layerInfoState,
            help: helpState,
            view: viewState,
            asyncronous: asyncState,
            settings: settingsState,
            share: shareState.set("isOpen", false),
            analytics: analyticsState,
            dateSlider: dateSliderState
        };

        // CHANGE
        expect(actual.share.toJS()).to.deep.equal(expected.share.toJS());

        // NO CHANGE
        expect(actual.map.remove("maps").toJS()).to.deep.equal(expected.map.toJS());
        expect(actual.layerInfo.toJS()).to.deep.equal(expected.layerInfo.toJS());
        expect(actual.help.toJS()).to.deep.equal(expected.help.toJS());
        expect(actual.view.toJS()).to.deep.equal(expected.view.toJS());
        expect(actual.asyncronous.toJS()).to.deep.equal(expected.asyncronous.toJS());
        expect(actual.settings.toJS()).to.deep.equal(expected.settings.toJS());
        expect(actual.dateSlider.toJS()).to.deep.equal(expected.dateSlider.toJS());
        expect(actual.analytics.toJS()).to.deep.equal(expected.analytics.toJS());
    });

    it('can open and close the share container.', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            AppActions.openShare(),
            AppActions.closeShare()
        ];

        actions.forEach(action => store.dispatch(action));

        const actual = store.getState();
        const expected = {
            map: mapState.remove("maps"),
            layerInfo: layerInfoState,
            help: helpState,
            view: viewState,
            asyncronous: asyncState,
            settings: settingsState,
            share: shareState.set("isOpen", false),
            analytics: analyticsState,
            dateSlider: dateSliderState
        };

        // CHANGE
        expect(actual.share.toJS()).to.deep.equal(expected.share.toJS());

        // NO CHANGE
        expect(actual.map.remove("maps").toJS()).to.deep.equal(expected.map.toJS());
        expect(actual.layerInfo.toJS()).to.deep.equal(expected.layerInfo.toJS());
        expect(actual.help.toJS()).to.deep.equal(expected.help.toJS());
        expect(actual.view.toJS()).to.deep.equal(expected.view.toJS());
        expect(actual.asyncronous.toJS()).to.deep.equal(expected.asyncronous.toJS());
        expect(actual.settings.toJS()).to.deep.equal(expected.settings.toJS());
        expect(actual.dateSlider.toJS()).to.deep.equal(expected.dateSlider.toJS());
        expect(actual.analytics.toJS()).to.deep.equal(expected.analytics.toJS());
    });
});
