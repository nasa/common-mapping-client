import * as actionTypes from '../constants/actionTypes';
import * as mapStrings from '../constants/mapStrings';
import * as appStrings from '../constants/appStrings';
import * as mapConfig from '../constants/mapConfig';
import * as mapActions from '../actions/MapActions';
import * as layerActions from '../actions/LayerActions';
import * as expectedOutput from './data/expectedOutput.js';
import { createStore, compose, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
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
import TestUtil from './TestUtil';
import moment from 'moment';

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

describe('Store - Map', function() {
    // add the html fixture from the DOM to give maps a place to render during tests
    beforeEach(function() {
        let fixture = '<div id="fixture"><div id="map2D"></div><div id="map3D"></div></div>';

        document.body.insertAdjacentHTML(
            'afterbegin',
            fixture);
    });

    // remove the html fixture from the DOM
    afterEach(function() {
        document.body.removeChild(document.getElementById('fixture'));
    });

    it('initializes 2D map', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(mapStrings.MAP_LIB_2D, "map2D")
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actualNumMaps = state.map.get("maps").size;
        const actualMap2D = state.map.get("maps").toJS()[mapStrings.MAP_LIB_2D];
        const actualMap3D = state.map.get("maps").toJS()[mapStrings.MAP_LIB_3D];
        const actual = {
            map: state.map.remove("maps"),
            view: state.view,
            asyncronous: state.asyncronous,
            help: state.help,
            settings: state.settings,
            share: state.share,
            dateSlider: state.dateSlider,
            analytics: state.analytics,
            layerInfo: state.layerInfo
        };

        const expected = {
            map: mapState.remove("maps"),
            view: viewState,
            asyncronous: asyncState,
            help: helpState,
            settings: settingsState,
            share: shareState,
            dateSlider: dateSliderState,
            analytics: analyticsState,
            layerInfo: layerInfoState
        };

        expect(actualNumMaps).to.equal(1);
        expect(actualMap2D).to.not.equal(undefined);
        expect(actualMap3D).to.equal(undefined);
        TestUtil.compareFullStates(actual, expected);
    });

    it('initializes 3D map', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(mapStrings.MAP_LIB_3D, "map3D")
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actualNumMaps = state.map.get("maps").size;
        const actualMap2D = state.map.get("maps").toJS()[mapStrings.MAP_LIB_2D];
        const actualMap3D = state.map.get("maps").toJS()[mapStrings.MAP_LIB_3D];
        const actual = {
            map: state.map.remove("maps"),
            view: state.view,
            asyncronous: state.asyncronous,
            help: state.help,
            settings: state.settings,
            share: state.share,
            dateSlider: state.dateSlider,
            analytics: state.analytics,
            layerInfo: state.layerInfo
        };

        const expected = {
            map: mapState.remove("maps"),
            view: viewState,
            asyncronous: asyncState,
            help: helpState,
            settings: settingsState,
            share: shareState,
            dateSlider: dateSliderState,
            analytics: analyticsState,
            layerInfo: layerInfoState
        };

        expect(actualNumMaps).to.equal(1);
        expect(actualMap2D).to.equal(undefined);
        expect(actualMap3D).to.not.equal(undefined);
        TestUtil.compareFullStates(actual, expected);
    });

    it('initializes 2D and 3D maps', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(mapStrings.MAP_LIB_2D, "map2D"),
            mapActions.initializeMap(mapStrings.MAP_LIB_3D, "map3D")
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actualNumMaps = state.map.get("maps").size;
        const actualMap2D = state.map.get("maps").toJS()[mapStrings.MAP_LIB_2D];
        const actualMap3D = state.map.get("maps").toJS()[mapStrings.MAP_LIB_3D];
        const actual = {
            map: state.map.remove("maps"),
            view: state.view,
            asyncronous: state.asyncronous,
            help: state.help,
            settings: state.settings,
            share: state.share,
            dateSlider: state.dateSlider,
            analytics: state.analytics,
            layerInfo: state.layerInfo
        };

        const expected = {
            map: mapState.remove("maps"),
            view: viewState,
            asyncronous: asyncState,
            help: helpState,
            settings: settingsState,
            share: shareState,
            dateSlider: dateSliderState,
            analytics: analyticsState,
            layerInfo: layerInfoState
        };

        expect(actualNumMaps).to.equal(2);
        expect(actualMap2D).to.not.equal(undefined);
        expect(actualMap3D).to.not.equal(undefined);
        TestUtil.compareFullStates(actual, expected);
    });

    it('initializes 3D and 2D maps', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(mapStrings.MAP_LIB_3D, "map3D"),
            mapActions.initializeMap(mapStrings.MAP_LIB_2D, "map2D")
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actualNumMaps = state.map.get("maps").size;
        const actualMap2D = state.map.get("maps").toJS()[mapStrings.MAP_LIB_2D];
        const actualMap3D = state.map.get("maps").toJS()[mapStrings.MAP_LIB_3D];
        const actual = {
            map: state.map.remove("maps"),
            view: state.view,
            asyncronous: state.asyncronous,
            help: state.help,
            settings: state.settings,
            share: state.share,
            dateSlider: state.dateSlider,
            analytics: state.analytics,
            layerInfo: state.layerInfo
        };

        const expected = {
            map: mapState.remove("maps"),
            view: viewState,
            asyncronous: asyncState,
            help: helpState,
            settings: settingsState,
            share: shareState,
            dateSlider: dateSliderState,
            analytics: analyticsState,
            layerInfo: layerInfoState
        };

        expect(actualNumMaps).to.equal(2);
        expect(actualMap2D).to.not.equal(undefined);
        expect(actualMap3D).to.not.equal(undefined);
        TestUtil.compareFullStates(actual, expected);
    });

    it('can enable 3D terrain', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(mapStrings.MAP_LIB_3D, "map3D"),
            mapActions.setTerrainEnabled(true)
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actualMap3D = state.map.get("maps").toJS()[mapStrings.MAP_LIB_3D];
        const actual = {
            map: state.map.remove("maps"),
            view: state.view,
            asyncronous: state.asyncronous,
            help: state.help,
            settings: state.settings,
            share: state.share,
            dateSlider: state.dateSlider,
            analytics: state.analytics,
            layerInfo: state.layerInfo
        };

        const expected = {
            map: mapState
                .remove("maps")
                .setIn(["displaySettings", "enableTerrain"], true),
            view: viewState,
            asyncronous: asyncState,
            help: helpState,
            settings: settingsState,
            share: shareState,
            dateSlider: dateSliderState,
            analytics: analyticsState,
            layerInfo: layerInfoState
        };

        expect(actualMap3D.map.terrainProvider._url).to.equal(mapConfig.DEFAULT_TERRAIN_ENDPOINT);
        TestUtil.compareFullStates(actual, expected);
    });

    it('can disable 3D terrain', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(mapStrings.MAP_LIB_3D, "map3D"),
            mapActions.setTerrainEnabled(true),
            mapActions.setTerrainEnabled(false)
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actualMap3D = state.map.get("maps").toJS()[mapStrings.MAP_LIB_3D];
        const actual = {
            map: state.map.remove("maps"),
            view: state.view,
            asyncronous: state.asyncronous,
            help: state.help,
            settings: state.settings,
            share: state.share,
            dateSlider: state.dateSlider,
            analytics: state.analytics,
            layerInfo: state.layerInfo
        };

        const expected = {
            map: mapState
                .remove("maps")
                .setIn(["displaySettings", "enableTerrain"], false),
            view: viewState,
            asyncronous: asyncState,
            help: helpState,
            settings: settingsState,
            share: shareState,
            dateSlider: dateSliderState,
            analytics: analyticsState,
            layerInfo: layerInfoState
        };

        expect(actualMap3D.map.terrainProvider._url).to.equal(undefined);
        TestUtil.compareFullStates(actual, expected);
    });

    it('can set map view mode to 3D without 2D map', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(mapStrings.MAP_LIB_3D, "map3D"),
            mapActions.setMapViewMode(mapStrings.MAP_VIEW_MODE_3D)
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actualNumMaps = state.map.get("maps").size;
        const actualMap3D = state.map.get("maps").toJS()[mapStrings.MAP_LIB_3D];
        const actual = {
            map: state.map.remove("maps"),
            view: state.view,
            asyncronous: state.asyncronous,
            help: state.help,
            settings: state.settings,
            share: state.share,
            dateSlider: state.dateSlider,
            analytics: state.analytics,
            layerInfo: state.layerInfo
        };

        const expected = {
            map: mapState
                .remove("maps")
                .setIn(["view", "in3DMode"], true),
            view: viewState,
            asyncronous: asyncState,
            help: helpState,
            settings: settingsState,
            share: shareState,
            dateSlider: dateSliderState,
            analytics: analyticsState,
            layerInfo: layerInfoState
        };

        expect(actualNumMaps).to.equal(1);
        expect(actualMap3D.isActive).to.equal(true);
        TestUtil.compareFullStates(actual, expected);
    });

    it('can set map view mode to 3D with 2D map', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(mapStrings.MAP_LIB_3D, "map3D"),
            mapActions.initializeMap(mapStrings.MAP_LIB_2D, "map2D"),
            mapActions.setMapViewMode(mapStrings.MAP_VIEW_MODE_3D)
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actualNumMaps = state.map.get("maps").size;
        const actualMap3D = state.map.get("maps").toJS()[mapStrings.MAP_LIB_3D];
        const actual = {
            map: state.map.remove("maps"),
            view: state.view,
            asyncronous: state.asyncronous,
            help: state.help,
            settings: state.settings,
            share: state.share,
            dateSlider: state.dateSlider,
            analytics: state.analytics,
            layerInfo: state.layerInfo
        };

        const expected = {
            map: mapState
                .remove("maps")
                .setIn(["view", "in3DMode"], true),
            view: viewState,
            asyncronous: asyncState,
            help: helpState,
            settings: settingsState,
            share: shareState,
            dateSlider: dateSliderState,
            analytics: analyticsState,
            layerInfo: layerInfoState
        };

        expect(actualNumMaps).to.equal(2);
        expect(actualMap3D.isActive).to.equal(true);
        TestUtil.compareFullStates(actual, expected);
    });

    it('can set map view mode to 2D without 3D map', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(mapStrings.MAP_LIB_2D, "map2D"),
            mapActions.setMapViewMode(mapStrings.MAP_VIEW_MODE_2D)
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actualNumMaps = state.map.get("maps").size;
        const actualMap2D = state.map.get("maps").toJS()[mapStrings.MAP_LIB_2D];
        const actual = {
            map: state.map.remove("maps"),
            view: state.view,
            asyncronous: state.asyncronous,
            help: state.help,
            settings: state.settings,
            share: state.share,
            dateSlider: state.dateSlider,
            analytics: state.analytics,
            layerInfo: state.layerInfo
        };

        const expected = {
            map: mapState
                .remove("maps")
                .setIn(["view", "in3DMode"], false),
            view: viewState,
            asyncronous: asyncState,
            help: helpState,
            settings: settingsState,
            share: shareState,
            dateSlider: dateSliderState,
            analytics: analyticsState,
            layerInfo: layerInfoState
        };

        expect(actualNumMaps).to.equal(1);
        expect(actualMap2D.isActive).to.equal(true);
        TestUtil.compareFullStates(actual, expected);
    });

    it('can set map view mode to 2D with 3D map', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(mapStrings.MAP_LIB_2D, "map2D"),
            mapActions.initializeMap(mapStrings.MAP_LIB_3D, "map3D"),
            mapActions.setMapViewMode(mapStrings.MAP_VIEW_MODE_2D)
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actualNumMaps = state.map.get("maps").size;
        const actualMap2D = state.map.get("maps").toJS()[mapStrings.MAP_LIB_2D];
        const actual = {
            map: state.map.remove("maps"),
            view: state.view,
            asyncronous: state.asyncronous,
            help: state.help,
            settings: state.settings,
            share: state.share,
            dateSlider: state.dateSlider,
            analytics: state.analytics,
            layerInfo: state.layerInfo
        };

        const expected = {
            map: mapState
                .remove("maps")
                .setIn(["view", "in3DMode"], false),
            view: viewState,
            asyncronous: asyncState,
            help: helpState,
            settings: settingsState,
            share: shareState,
            dateSlider: dateSliderState,
            analytics: analyticsState,
            layerInfo: layerInfoState
        };

        expect(actualNumMaps).to.equal(2);
        expect(actualMap2D.isActive).to.equal(true);
        TestUtil.compareFullStates(actual, expected);
    });

    it('can reset 3D map orientation', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(mapStrings.MAP_LIB_3D, "map3D"),
            mapActions.setMapViewMode(mapStrings.MAP_VIEW_MODE_3D),
            mapActions.resetOrientation(0)
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actualNumMaps = state.map.get("maps").size;
        const actualMap3D = state.map.get("maps").toJS()[mapStrings.MAP_LIB_3D];
        const actual = {
            map: state.map.remove("maps"),
            view: state.view,
            asyncronous: state.asyncronous,
            help: state.help,
            settings: state.settings,
            share: state.share,
            dateSlider: state.dateSlider,
            analytics: state.analytics,
            layerInfo: state.layerInfo
        };

        const expected = {
            map: mapState
                .remove("maps")
                .setIn(["view", "in3DMode"], true),
            view: viewState,
            asyncronous: asyncState,
            help: helpState,
            settings: settingsState,
            share: shareState,
            dateSlider: dateSliderState,
            analytics: analyticsState,
            layerInfo: layerInfoState
        };

        expect(actualNumMaps).to.equal(1);
        expect(actualMap3D.map.camera.heading).to.equal(6.283185307179586);
        expect(actualMap3D.map.camera.roll).to.equal(0);
        expect(actualMap3D.map.camera.pitch).to.equal(-1.5707963267948966);
        TestUtil.compareFullStates(actual, expected);
    });

    it('can set 2D map view info', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(mapStrings.MAP_LIB_2D, "map2D"),
            mapActions.initializeMap(mapStrings.MAP_LIB_3D, "map3D"),
            mapActions.setMapViewMode(mapStrings.MAP_VIEW_MODE_3D),
            mapActions.setMapViewInfo({
                center: [0, 0],
                extent: [-123.94365615697467, 45.71109896680252, -116.91240615697467, 49.03995638867752],
                projection: mapConfig.DEFAULT_PROJECTION,
                zoom: 8
            })
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actualNumMaps = state.map.get("maps").size;
        const actualMap2D = state.map.get("maps").toJS()[mapStrings.MAP_LIB_2D];
        const actualMap3D = state.map.get("maps").toJS()[mapStrings.MAP_LIB_3D];
        const actual = {
            map: state.map.remove("maps"),
            view: state.view,
            asyncronous: state.asyncronous,
            help: state.help,
            settings: state.settings,
            share: state.share,
            dateSlider: state.dateSlider,
            analytics: state.analytics,
            layerInfo: state.layerInfo
        };

        const expected = {
            map: mapState.remove("maps")
                .setIn(["view", "in3DMode"], true)
                .setIn(["view", "center"], [0, 0])
                .setIn(["view", "extent"], [-123.94365615697467, 45.71109896680252, -116.91240615697467, 49.03995638867752])
                .setIn(["view", "projection"], mapConfig.DEFAULT_PROJECTION)
                .setIn(["view", "zoom"], 8),
            view: viewState,
            asyncronous: asyncState,
            help: helpState,
            settings: settingsState,
            share: shareState,
            dateSlider: dateSliderState,
            analytics: analyticsState,
            layerInfo: layerInfoState
        };

        expect(actualNumMaps).to.equal(2);
        TestUtil.compareFullStates(actual, expected);
    });

    it('can set 3D map view info', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(mapStrings.MAP_LIB_2D, "map2D"),
            mapActions.initializeMap(mapStrings.MAP_LIB_3D, "map3D"),
            mapActions.setMapViewMode(mapStrings.MAP_VIEW_MODE_2D),
            mapActions.setMapViewInfo({
                center: [0, 0],
                extent: [-123.94365615697467, 45.71109896680252, -116.91240615697467, 49.03995638867752]
            })
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actualNumMaps = state.map.get("maps").size;
        const actualMap2D = state.map.get("maps").toJS()[mapStrings.MAP_LIB_2D];
        const actualMap3D = state.map.get("maps").toJS()[mapStrings.MAP_LIB_3D];
        const actual = {
            map: state.map.remove("maps"),
            view: state.view,
            asyncronous: state.asyncronous,
            help: state.help,
            settings: state.settings,
            share: state.share,
            dateSlider: state.dateSlider,
            analytics: state.analytics,
            layerInfo: state.layerInfo
        };

        const expected = {
            map: mapState.remove("maps")
                .setIn(["view", "in3DMode"], false)
                .setIn(["view", "center"], [0, 0])
                .setIn(["view", "extent"], [-123.94365615697467, 45.71109896680252, -116.91240615697467, 49.03995638867752]),
            view: viewState,
            asyncronous: asyncState,
            help: helpState,
            settings: settingsState,
            share: shareState,
            dateSlider: dateSliderState,
            analytics: analyticsState,
            layerInfo: layerInfoState
        };

        expect(actualNumMaps).to.equal(2);
        TestUtil.compareFullStates(actual, expected);
    });

    it('sets the map date', function() {
        const store = createStore(rootReducer, initialState);

        const dateFormat = "YYYY-MM-DD";
        const newDate = moment("2003-01-01", dateFormat).toDate();

        const actions = [
            mapActions.setDate(newDate)
        ];
        actions.forEach(action => store.dispatch(action));

        const actual = store.getState();

        const expected = {
            map: mapState.set("date", newDate),
            view: viewState,
            asyncronous: asyncState,
            help: helpState,
            settings: settingsState,
            share: shareState,
            analytics: analyticsState,
            dateSlider: dateSliderState,
            layerInfo: layerInfoState
        };

        TestUtil.compareFullStates(actual, expected);
    });

    it('can zoom out', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(mapStrings.MAP_LIB_2D, "map2D"),
            mapActions.initializeMap(mapStrings.MAP_LIB_3D, "map3D"),
            mapActions.zoomOut()
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actual = {
            map: state.map.remove("maps"),
            view: state.view,
            asyncronous: state.asyncronous,
            help: state.help,
            settings: state.settings,
            share: state.share,
            dateSlider: state.dateSlider,
            analytics: state.analytics,
            layerInfo: state.layerInfo
        };

        const expected = {
            map: mapState
                .remove("maps")
                .setIn(["view", "zoom"], mapState.getIn(["view", "zoom"]) - 1),
            view: viewState,
            asyncronous: asyncState,
            help: helpState,
            settings: settingsState,
            share: shareState,
            dateSlider: dateSliderState,
            analytics: analyticsState,
            layerInfo: layerInfoState
        };

        TestUtil.compareFullStates(actual, expected);
    });

    it('can zoom in', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(mapStrings.MAP_LIB_2D, "map2D"),
            mapActions.initializeMap(mapStrings.MAP_LIB_3D, "map3D"),
            mapActions.zoomIn()
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actual = {
            map: state.map.remove("maps"),
            view: state.view,
            asyncronous: state.asyncronous,
            help: state.help,
            settings: state.settings,
            share: state.share,
            dateSlider: state.dateSlider,
            analytics: state.analytics,
            layerInfo: state.layerInfo
        };

        const expected = {
            map: mapState
                .remove("maps")
                .setIn(["view", "zoom"], mapState.getIn(["view", "zoom"]) + 1),
            view: viewState,
            asyncronous: asyncState,
            help: helpState,
            settings: settingsState,
            share: shareState,
            dateSlider: dateSliderState,
            analytics: analyticsState,
            layerInfo: layerInfoState
        };

        TestUtil.compareFullStates(actual, expected);
    });

    it('can zoom in and out', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(mapStrings.MAP_LIB_2D, "map2D"),
            mapActions.initializeMap(mapStrings.MAP_LIB_3D, "map3D"),
            mapActions.zoomIn(),
            mapActions.zoomOut()
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actual = {
            map: state.map.remove("maps"),
            view: state.view,
            asyncronous: state.asyncronous,
            help: state.help,
            settings: state.settings,
            share: state.share,
            dateSlider: state.dateSlider,
            analytics: state.analytics,
            layerInfo: state.layerInfo
        };

        const expected = {
            map: mapState.remove("maps"),
            view: viewState,
            asyncronous: asyncState,
            help: helpState,
            settings: settingsState,
            share: shareState,
            dateSlider: dateSliderState,
            analytics: analyticsState,
            layerInfo: layerInfoState
        };

        TestUtil.compareFullStates(actual, expected);
    });

    it('can set scale units with 2D map', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(mapStrings.MAP_LIB_2D, "map2D"),
            mapActions.setScaleUnits(mapConfig.SCALE_OPTIONS[1].value)
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actual = {
            map: state.map.remove("maps"),
            view: state.view,
            asyncronous: state.asyncronous,
            help: state.help,
            settings: state.settings,
            share: state.share,
            dateSlider: state.dateSlider,
            analytics: state.analytics,
            layerInfo: state.layerInfo
        };

        const expected = {
            map: mapState
                .remove("maps")
                .setIn(["displaySettings", "selectedScaleUnits"], mapConfig.SCALE_OPTIONS[1].value),
            view: viewState,
            asyncronous: asyncState,
            help: helpState,
            settings: settingsState,
            share: shareState,
            dateSlider: dateSliderState,
            analytics: analyticsState,
            layerInfo: layerInfoState
        };

        TestUtil.compareFullStates(actual, expected);
    });

    it('can injest wmts and json layer configurations as well as palette configurations. Big test.', function(done) {
        // adjust default timeout
        this.timeout(2000);

        // create store with async action support
        const store = createStore(rootReducer, initialState, compose(applyMiddleware(thunkMiddleware)));

        const actions = [
            layerActions.fetchInitialData()
        ];
        actions.forEach(action => store.dispatch(action));

        setTimeout(() => {
            const state = store.getState();
            const actual = {
                map: state.map.remove("maps"),
                view: state.view,
                asyncronous: state.asyncronous,
                help: state.help,
                settings: state.settings,
                share: state.share,
                dateSlider: state.dateSlider,
                analytics: state.analytics,
                layerInfo: state.layerInfo
            };

            const expected = {
                map: mapState
                    .remove("maps")
                    .set("palettes", mapState.get("palettes").merge(expectedOutput.INGESTED_PALETTES))
                    .set("layers", mapState.get("layers").merge(expectedOutput.INGESTED_LAYERS))
                    .removeIn(["layers", "partial"]),
                asyncronous: asyncState
                    .set("loadingInitialData", false)
                    .set("initialLoadingAttempted", true)
                    .set("loadingLayerSources", false)
                    .set("layerLoadingAttempted", true)
                    .set("loadingLayerPalettes", false)
                    .set("paletteLoadingAttempted", true),
                view: viewState,
                help: helpState,
                settings: settingsState,
                share: shareState,
                dateSlider: dateSliderState,
                analytics: analyticsState,
                layerInfo: layerInfoState
            };

            TestUtil.compareFullStates(actual, expected);
            done();
        }, 1000);
    });
});
