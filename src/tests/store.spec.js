import * as actionTypes from '../constants/actionTypes';
import * as mapStrings from '../constants/mapStrings';
import * as appStrings from '../constants/appStrings';
import * as mapConfig from '../constants/mapConfig';
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
import MapUtil from '../utils/MapUtil.js';


const initialState = {
    map: mapState,
    view: viewState,
    asyncronous: asyncState,
    help: helpState,
    settings: settingsState,
    share: shareState,
    dateSlider: dateSliderState,
    analytics: analyticsState
};


describe('Store', function() {
    it('open -> close -> open help.', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            { type: actionTypes.OPEN_HELP },
            { type: actionTypes.CLOSE_HELP },
            { type: actionTypes.OPEN_HELP }
        ];
        actions.forEach(action => store.dispatch(action));

        const actual = store.getState();
        const expected = {
            map: mapState,
            view: viewState,
            asyncronous: asyncState,
            help: helpState.set("isOpen", true),
            settings: settingsState
        };

        expect(actual.map.toJS()).to.deep.equal(expected.map.toJS());
        expect(actual.view.toJS()).to.deep.equal(expected.view.toJS());
        expect(actual.asyncronous.toJS()).to.deep.equal(expected.asyncronous.toJS());
        expect(actual.help.toJS()).to.deep.equal(expected.help.toJS());
        expect(actual.settings.toJS()).to.deep.equal(expected.settings.toJS());
    });
    it('open -> close -> open settings.', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            { type: actionTypes.OPEN_SETTINGS },
            { type: actionTypes.CLOSE_SETTINGS },
            { type: actionTypes.OPEN_SETTINGS }
        ];
        actions.forEach(action => store.dispatch(action));

        const actual = store.getState();
        const expected = {
            map: mapState,
            view: viewState,
            asyncronous: asyncState,
            help: helpState,
            settings: settingsState.set("isOpen", true)
        };

        expect(actual.map.toJS()).to.deep.equal(expected.map.toJS());
        expect(actual.view.toJS()).to.deep.equal(expected.view.toJS());
        expect(actual.asyncronous.toJS()).to.deep.equal(expected.asyncronous.toJS());
        expect(actual.help.toJS()).to.deep.equal(expected.help.toJS());
        expect(actual.settings.toJS()).to.deep.equal(expected.settings.toJS());
    });
    it('enables user analytics', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            { type: actionTypes.SET_ANALYTICS_ENABLED, isEnabled: true }
        ];
        actions.forEach(action => store.dispatch(action));

        const actual = store.getState();
        const expected = {
            analytics: analyticsState.set("isEnabled", true).remove("currentBatch")
        };
        // console.log("ACTUAL\n",JSON.stringify(actual.analytics.remove("currentBatch").toJS()));
        // console.log("EXPECTED\n",JSON.stringify(expected.analytics.remove("currentBatch").toJS()));
        expect(actual.analytics.remove("currentBatch").toJS()).to.deep.equal(expected.analytics.toJS());
    });
    it('disables user analytics', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            { type: actionTypes.SET_ANALYTICS_ENABLED, isEnabled: false }
        ];
        actions.forEach(action => store.dispatch(action));

        const actual = store.getState();
        const expected = {
            analytics: analyticsState.set("isEnabled", false).remove("currentBatch")
        };
        // console.log("ACTUAL\n",JSON.stringify(actual.analytics.remove("currentBatch").toJS()));
        // console.log("EXPECTED\n",JSON.stringify(expected.analytics.remove("currentBatch").toJS()));
        expect(actual.analytics.remove("currentBatch").toJS()).to.deep.equal(expected.analytics.toJS());
    });
    it('enables auto update url', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            { type: actionTypes.SET_AUTO_UPDATE_URL, autoUpdateUrl: true }
        ];
        actions.forEach(action => store.dispatch(action));

        const actual = store.getState();
        const expected = {
            share: shareState.set("autoUpdateUrl", true)
        };
        expect(actual.share.toJS()).to.deep.equal(expected.share.toJS());
    });
    it('disables auto update url', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            { type: actionTypes.SET_AUTO_UPDATE_URL, autoUpdateUrl: false }
        ];
        actions.forEach(action => store.dispatch(action));

        const actual = store.getState();
        const expected = {
            share: shareState.set("autoUpdateUrl", false)
        };
        expect(actual.share.toJS()).to.deep.equal(expected.share.toJS());
    });
    // it('should auto update url if setting enabled.', function() {
    //     const store = createStore(rootReducer, initialState);

    //     const targetDate = new Date("2015-05-20");
    //     const actions = [
    //         { type: actionTypes.INITIALIZE_MAP, mapType: mapStrings.MAP_LIB_2D },
    //         { type: actionTypes.OPEN_SHARE },
    //         { type: actionTypes.CLOSE_SHARE },
    //         { type: actionTypes.SET_AUTO_UPDATE_URL, autoUpdateUrl: true },
    //         { type: actionTypes.SET_TERRAIN_ENABLED, enabled: false },
    //         { type: actionTypes.SET_MAP_DATE, date: targetDate }
    //     ];
    //     actions.forEach(action => store.dispatch(action));

    //     const actual = store.getState();
    //     const expected = {
    //         view: viewState,
    //         asyncronous: asyncState,
    //         share: shareState
    //     };
    //     console.log(window.location.href);

    //     // expect(actual.map.toJS()).to.deep.equal(expected.map.toJS());
    //     expect(actual.view.toJS()).to.deep.equal(expected.view.toJS());
    //     expect(actual.asyncronous.toJS()).to.deep.equal(expected.asyncronous.toJS());
    //     expect(actual.share.toJS()).to.deep.equal(expected.share.toJS());
    // });
    it('open -> close -> open share.', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            { type: actionTypes.OPEN_SHARE },
            { type: actionTypes.CLOSE_SHARE },
            { type: actionTypes.OPEN_SHARE }
        ];
        actions.forEach(action => store.dispatch(action));

        const actual = store.getState();
        const expected = {
            map: mapState,
            view: viewState,
            asyncronous: asyncState,
            help: helpState,
            share: shareState.set("isOpen", true),
            settings: settingsState
        };

        expect(actual.map.toJS()).to.deep.equal(expected.map.toJS());
        expect(actual.view.toJS()).to.deep.equal(expected.view.toJS());
        expect(actual.asyncronous.toJS()).to.deep.equal(expected.asyncronous.toJS());
        expect(actual.help.toJS()).to.deep.equal(expected.help.toJS());
        expect(actual.share.toJS()).to.deep.equal(expected.share.toJS());
        expect(actual.settings.toJS()).to.deep.equal(expected.settings.toJS());
    });
    it('resets application state correctly', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            { type: actionTypes.INITIALIZE_MAP, mapType: mapStrings.MAP_LIB_2D },
            { type: actionTypes.SET_MAP_VIEW_MODE, mode: mapStrings.MAP_VIEW_MODE_3D }, {
                type: actionTypes.ZOOM_IN,
                geometry: {
                    type: mapStrings.GEOMETRY_CIRCLE,
                    center: { lon: 0, lat: 0 },
                    radius: 500,
                    coordinateType: mapStrings.COORDINATE_TYPE_CARTOGRAPHIC
                }
            },
            { type: actionTypes.REMOVE_ALL_GEOMETRIES },
            { type: actionTypes.SET_MAP_VIEW_MODE, mode: mapStrings.MAP_VIEW_MODE_3D }, {
                type: actionTypes.ZOOM_IN,
                geometry: {
                    type: mapStrings.GEOMETRY_CIRCLE,
                    center: { lon: 10, lat: -20 },
                    radius: 52200,
                    coordinateType: mapStrings.COORDINATE_TYPE_CARTOGRAPHIC
                }
            },
            { type: actionTypes.ZOOM_IN },
            { type: actionTypes.SET_TERRAIN_ENABLED, enabled: false },
            { type: actionTypes.SET_SCALE_UNITS, units: mapConfig.SCALE_OPTIONS[1].value },
            { type: actionTypes.ZOOM_OUT },
            { type: actionTypes.RESET_ORIENTATION },
            { type: actionTypes.SET_SLIDER_COLLAPSED, collapsed: true },
            { type: actionTypes.SET_DATE_RESOLUTION, resolution: appStrings.DATE_SLIDER_RESOLUTIONS.MONTHS },
            { type: actionTypes.RESET_APPLICATION_STATE }
        ];
        actions.forEach(action => store.dispatch(action));

        const actual = store.getState();
        const expected = {
            map: mapState.remove("maps"),
            view: viewState,
            asyncronous: asyncState,
            help: helpState,
            settings: settingsState,
            share: shareState,
            analytics: analyticsState,
            dateSlider: dateSliderState.set("resolution", appStrings.DATE_SLIDER_RESOLUTIONS.YEARS).set("isSelectingResolution", false)
        };

        // console.log("ACTUAL\n", JSON.stringify(actual.map.remove("maps").toJS()));
        // console.log("EXPECTED\n", JSON.stringify(expected.map.toJS()));

        // console.log("ACTUAL\n",JSON.stringify(actual.dateSlider.toJS()));
        // console.log("EXPECTED\n",JSON.stringify(expected.dateSlider.toJS()));

        // console.log("ACTUAL\n",JSON.stringify(actual.view.toJS()));
        // console.log("EXPECTED\n",JSON.stringify(expected.view.toJS()));

        // console.log("ACTUAL\n",JSON.stringify(actual.analytics.remove("currentBatch").toJS()));
        // console.log("EXPECTED\n",JSON.stringify(expected.analytics.remove("currentBatch").toJS()));



        expect(actual.view.toJS()).to.deep.equal(expected.view.toJS());
        expect(actual.asyncronous.toJS()).to.deep.equal(expected.asyncronous.toJS());
        expect(actual.help.toJS()).to.deep.equal(expected.help.toJS());
        expect(actual.settings.toJS()).to.deep.equal(expected.settings.toJS());
        expect(actual.share.toJS()).to.deep.equal(expected.share.toJS());
        expect(actual.analytics.remove("currentBatch").remove("timeLastSent").toJS()).to.deep.equal(expected.analytics.remove("currentBatch").remove("timeLastSent").toJS());
        expect(actual.map.remove("maps").toJS()).to.deep.equal(expected.map.toJS());
        expect(actual.dateSlider.toJS()).to.deep.equal(expected.dateSlider.toJS());
    });

    it('initializes maps', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            { type: actionTypes.INITIALIZE_MAP, mapType: mapStrings.MAP_LIB_2D }
        ];
        actions.forEach(action => store.dispatch(action));


        const actual = store.getState();
        const expected = {
            map: mapState.remove("maps"),
            view: viewState,
            asyncronous: asyncState,
            help: helpState,
            settings: settingsState
        };

        expect(actual.map.get("maps").size).to.equal(1);
        expect(actual.map.remove("maps").toJS()).to.deep.equal(expected.map.toJS());
        expect(actual.map.remove("maps").toJS()).to.deep.equal(expected.map.toJS());
        expect(actual.view.toJS()).to.deep.equal(expected.view.toJS());
        expect(actual.asyncronous.toJS()).to.deep.equal(expected.asyncronous.toJS());
        expect(actual.help.toJS()).to.deep.equal(expected.help.toJS());
        expect(actual.settings.toJS()).to.deep.equal(expected.settings.toJS());
    });
    it('can zoom maps and stuff', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            { type: actionTypes.INITIALIZE_MAP, mapType: mapStrings.MAP_LIB_2D },
            { type: actionTypes.ZOOM_IN },
            { type: actionTypes.ZOOM_IN },
            { type: actionTypes.ZOOM_OUT },
            { type: actionTypes.ZOOM_IN },
            { type: actionTypes.ZOOM_OUT }
        ];
        actions.forEach(action => store.dispatch(action));


        const actual = store.getState();
        const expected = {
            map: mapState.remove("maps").setIn(["view", "zoom"], mapState.getIn(["view", "zoom"]) + 1),
            view: viewState,
            asyncronous: asyncState,
            help: helpState,
            settings: settingsState
        };

        expect(actual.map.get("maps").size).to.equal(1);
        expect(actual.map.remove("maps").get("view").toJS()).to.deep.equal(expected.map.remove("maps").get("view").toJS());
        expect(actual.view.toJS()).to.deep.equal(expected.view.toJS());
        expect(actual.asyncronous.toJS()).to.deep.equal(expected.asyncronous.toJS());
        expect(actual.help.toJS()).to.deep.equal(expected.help.toJS());
        expect(actual.settings.toJS()).to.deep.equal(expected.settings.toJS());
    });
});
