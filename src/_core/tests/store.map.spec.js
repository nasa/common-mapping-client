import * as actionTypes from '../constants/actionTypes';
import * as appStrings from '../constants/appStrings';
import * as appConfig from '../constants/appConfig';
import * as mapActions from '../actions/MapActions';
import * as layerActions from '../actions/LayerActions';
import * as initialIngest from './data/expectedOutputs/initialIngest';
import * as activateInactivateLayers from './data/expectedOutputs/activateInactivateLayers';
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
import MiscUtil from '../utils/MiscUtil';
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
        document.body.insertAdjacentHTML('afterbegin', fixture);
    });

    // remove the html fixture from the DOM
    afterEach(function() {
        document.body.removeChild(document.getElementById('fixture'));
    });

    it('initializes 2D map', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D")
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actualNumMaps = state.map.get("maps").size;
        const actualMap2D = state.map.get("maps").toJS()[appStrings.MAP_LIB_2D];
        const actualMap3D = state.map.get("maps").toJS()[appStrings.MAP_LIB_3D];

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map.remove("maps");

        expect(actualNumMaps).to.equal(1);
        expect(actualMap2D).to.not.equal(undefined);
        expect(actualMap3D).to.equal(undefined);
        TestUtil.compareFullStates(actual, expected);
    });

    it('initializes 3D map', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D")
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actualNumMaps = state.map.get("maps").size;
        const actualMap2D = state.map.get("maps").toJS()[appStrings.MAP_LIB_2D];
        const actualMap3D = state.map.get("maps").toJS()[appStrings.MAP_LIB_3D];

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map.remove("maps");

        expect(actualNumMaps).to.equal(1);
        expect(actualMap2D).to.equal(undefined);
        expect(actualMap3D).to.not.equal(undefined);
        TestUtil.compareFullStates(actual, expected);
    });

    it('initializes 2D and 3D maps', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
            mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D")
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actualNumMaps = state.map.get("maps").size;
        const actualMap2D = state.map.get("maps").toJS()[appStrings.MAP_LIB_2D];
        const actualMap3D = state.map.get("maps").toJS()[appStrings.MAP_LIB_3D];

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map.remove("maps");

        expect(actualNumMaps).to.equal(2);
        expect(actualMap2D).to.not.equal(undefined);
        expect(actualMap3D).to.not.equal(undefined);
        TestUtil.compareFullStates(actual, expected);
    });

    it('initializes 3D and 2D maps', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D"),
            mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D")
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actualNumMaps = state.map.get("maps").size;
        const actualMap2D = state.map.get("maps").toJS()[appStrings.MAP_LIB_2D];
        const actualMap3D = state.map.get("maps").toJS()[appStrings.MAP_LIB_3D];

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map.remove("maps");

        expect(actualNumMaps).to.equal(2);
        expect(actualMap2D).to.not.equal(undefined);
        expect(actualMap3D).to.not.equal(undefined);
        TestUtil.compareFullStates(actual, expected);
    });

    it('can enable 3D terrain', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D"),
            mapActions.setTerrainEnabled(true)
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actualMap3D = state.map.get("maps").toJS()[appStrings.MAP_LIB_3D];

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map
            .remove("maps")
            .setIn(["displaySettings", "enableTerrain"], true);

        expect(actualMap3D.map.terrainProvider._url).to.equal(appConfig.DEFAULT_TERRAIN_ENDPOINT);
        TestUtil.compareFullStates(actual, expected);
    });

    it('can set 3D terrain exaggeration', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D"),
            mapActions.setTerrainExaggeration(appConfig.TERRAIN_EXAGGERATION_OPTIONS[1].value)
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actualMap3D = state.map.get("maps").toJS()[appStrings.MAP_LIB_3D];

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map
            .remove("maps")
            .setIn(["displaySettings", "selectedTerrainExaggeration"], appConfig.TERRAIN_EXAGGERATION_OPTIONS[1].value);

        expect(actualMap3D.map.scene.terrainExaggeration).to.equal(appConfig.TERRAIN_EXAGGERATION_OPTIONS[1].value);
        TestUtil.compareFullStates(actual, expected);
    });

    it('can disable 3D terrain', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D"),
            mapActions.setTerrainEnabled(true),
            mapActions.setTerrainEnabled(false)
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actualMap3D = state.map.get("maps").toJS()[appStrings.MAP_LIB_3D];

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map
            .remove("maps")
            .setIn(["displaySettings", "enableTerrain"], false);

        expect(actualMap3D.map.terrainProvider._url).to.equal(undefined);
        TestUtil.compareFullStates(actual, expected);
    });

    it('can set map view mode to 3D without 2D map', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D"),
            mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_3D)
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actualNumMaps = state.map.get("maps").size;
        const actualMap3D = state.map.get("maps").toJS()[appStrings.MAP_LIB_3D];

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map
            .remove("maps")
            .setIn(["view", "in3DMode"], true);

        expect(actualNumMaps).to.equal(1);
        expect(actualMap3D.isActive).to.equal(true);
        TestUtil.compareFullStates(actual, expected);
    });

    it('can set map view mode to 3D with 2D map', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D"),
            mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
            mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_3D)
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actualNumMaps = state.map.get("maps").size;
        const actualMap3D = state.map.get("maps").toJS()[appStrings.MAP_LIB_3D];

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map
            .remove("maps")
            .setIn(["view", "in3DMode"], true);

        expect(actualNumMaps).to.equal(2);
        expect(actualMap3D.isActive).to.equal(true);
        TestUtil.compareFullStates(actual, expected);
    });

    it('can set map view mode to 2D without 3D map', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
            mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_2D)
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actualNumMaps = state.map.get("maps").size;
        const actualMap2D = state.map.get("maps").toJS()[appStrings.MAP_LIB_2D];

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map
            .remove("maps")
            .setIn(["view", "in3DMode"], false);

        expect(actualNumMaps).to.equal(1);
        expect(actualMap2D.isActive).to.equal(true);
        TestUtil.compareFullStates(actual, expected);
    });

    it('can set map view mode to 2D with 3D map', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
            mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D"),
            mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_3D),
            mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_2D)
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actualNumMaps = state.map.get("maps").size;
        const actualMap2D = state.map.get("maps").toJS()[appStrings.MAP_LIB_2D];

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map
            .remove("maps")
            .setIn(["view", "in3DMode"], false);

        expect(actualNumMaps).to.equal(2);
        expect(actualMap2D.isActive).to.equal(true);
        TestUtil.compareFullStates(actual, expected);
    });

    it('can reset 3D map orientation', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D"),
            mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_3D),
            mapActions.resetOrientation(0)
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actualNumMaps = state.map.get("maps").size;
        const actualMap3D = state.map.get("maps").toJS()[appStrings.MAP_LIB_3D];

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map
            .remove("maps")
            .setIn(["view", "in3DMode"], true);

        expect(actualNumMaps).to.equal(1);
        expect(actualMap3D.map.camera.heading).to.equal(6.283185307179586);
        expect(actualMap3D.map.camera.roll).to.equal(0);
        expect(actualMap3D.map.camera.pitch).to.equal(-1.5707963267948966);
        TestUtil.compareFullStates(actual, expected);
    });

    it('can set 2D map view info', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
            mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D"),
            mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_3D),
            mapActions.setMapViewInfo({
                center: [0, 0],
                extent: [-123.94365615697467, 45.71109896680252, -116.91240615697467, 49.03995638867752],
                projection: appConfig.DEFAULT_PROJECTION,
                zoom: 8
            })
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actualNumMaps = state.map.get("maps").size;
        const actualMap2D = state.map.get("maps").toJS()[appStrings.MAP_LIB_2D];
        const actualMap3D = state.map.get("maps").toJS()[appStrings.MAP_LIB_3D];

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map
            .remove("maps")
            .setIn(["view", "in3DMode"], true)
            .setIn(["view", "center"], [0, 0])
            .setIn(["view", "extent"], [-123.94365615697467, 45.71109896680252, -116.91240615697467, 49.03995638867752])
            .setIn(["view", "projection"], appConfig.DEFAULT_PROJECTION)
            .setIn(["view", "zoom"], 8);

        expect(actualNumMaps).to.equal(2);
        TestUtil.compareFullStates(actual, expected);
    });

    it('can set 3D map view info', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
            mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D"),
            mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_2D),
            mapActions.setMapViewInfo({
                center: [0, 0],
                extent: [-123.94365615697467, 45.71109896680252, -116.91240615697467, 49.03995638867752]
            })
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();
        const actualNumMaps = state.map.get("maps").size;
        const actualMap2D = state.map.get("maps").toJS()[appStrings.MAP_LIB_2D];
        const actualMap3D = state.map.get("maps").toJS()[appStrings.MAP_LIB_3D];

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map
            .remove("maps")
            .setIn(["view", "in3DMode"], false)
            .setIn(["view", "center"], [0, 0])
            .setIn(["view", "extent"], [-123.94365615697467, 45.71109896680252, -116.91240615697467, 49.03995638867752]);

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

        const state = store.getState();
        const actual = {...state };

        const expected = {...initialState };
        expected.map = expected.map.set("date", newDate);

        TestUtil.compareFullStates(actual, expected);
    });

    it('can zoom out', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
            mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D"),
            mapActions.zoomOut()
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map
            .remove("maps")
            .setIn(["view", "zoom"], mapState.getIn(["view", "zoom"]) - 1);

        TestUtil.compareFullStates(actual, expected);
    });

    it('can zoom in', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
            mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D"),
            mapActions.zoomIn()
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map
            .remove("maps")
            .setIn(["view", "zoom"], mapState.getIn(["view", "zoom"]) + 1);

        TestUtil.compareFullStates(actual, expected);
    });

    it('can zoom in and out', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
            mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D"),
            mapActions.zoomIn(),
            mapActions.zoomOut()
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map.remove("maps");

        TestUtil.compareFullStates(actual, expected);
    });

    it('can set scale units with 2D map', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
            mapActions.setScaleUnits(appConfig.SCALE_OPTIONS[1].value)
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map
            .remove("maps")
            .setIn(["displaySettings", "selectedScaleUnits"], appConfig.SCALE_OPTIONS[1].value);

        TestUtil.compareFullStates(actual, expected);
    });

    it('can enable drawing a circle on a 2D map', function() {
        const store = createStore(rootReducer, initialState);

        // initial map
        const initalActions = [
            mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
            mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_2D)
        ];
        initalActions.forEach(action => store.dispatch(action));

        // retrieve map object
        const initialState = store.getState();
        const actualMap2D = initialState.map.get("maps").toJS()[appStrings.MAP_LIB_2D];

        // add drawing on the map
        actualMap2D.addDrawHandler(appStrings.GEOMETRY_CIRCLE, () => {}, appStrings.INTERACTION_DRAW);

        // enable drawing
        const finalActions = [
            mapActions.enableDrawing(appStrings.GEOMETRY_CIRCLE)
        ];
        finalActions.forEach(action => store.dispatch(action));

        const state = store.getState();

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map
            .remove("maps")
            .setIn(["view", "in3DMode"], false)
            .setIn(["drawing", "isDrawingEnabled"], true)
            .setIn(["drawing", "geometryType"], appStrings.GEOMETRY_CIRCLE)
            .setIn(["measuring", "isMeasuringEnabled"], false);

        TestUtil.compareFullStates(actual, expected);
    });

    it('can enable drawing a line on a 2D map', function() {
        const store = createStore(rootReducer, initialState);

        // initial map
        const initalActions = [
            mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
            mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_2D)
        ];
        initalActions.forEach(action => store.dispatch(action));

        // retrieve map object
        const initialState = store.getState();
        const actualMap2D = initialState.map.get("maps").toJS()[appStrings.MAP_LIB_2D];

        // add drawing on the map
        actualMap2D.addDrawHandler(appStrings.GEOMETRY_LINE_STRING, () => {}, appStrings.INTERACTION_DRAW);

        // enable drawing
        const finalActions = [
            mapActions.enableDrawing(appStrings.GEOMETRY_LINE_STRING)
        ];
        finalActions.forEach(action => store.dispatch(action));

        const state = store.getState();

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map
            .remove("maps")
            .setIn(["view", "in3DMode"], false)
            .setIn(["drawing", "isDrawingEnabled"], true)
            .setIn(["drawing", "geometryType"], appStrings.GEOMETRY_LINE_STRING)
            .setIn(["measuring", "isMeasuringEnabled"], false);
    });

    it('can enable drawing a polygon on a 2D map', function() {
        const store = createStore(rootReducer, initialState);

        // initial map
        const initalActions = [
            mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
            mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_2D)
        ];
        initalActions.forEach(action => store.dispatch(action));

        // retrieve map object
        const initialState = store.getState();
        const actualMap2D = initialState.map.get("maps").toJS()[appStrings.MAP_LIB_2D];

        // add drawing on the map
        actualMap2D.addDrawHandler(appStrings.GEOMETRY_POLYGON, () => {}, appStrings.INTERACTION_DRAW);

        // enable drawing
        const finalActions = [
            mapActions.enableDrawing(appStrings.GEOMETRY_POLYGON)
        ];
        finalActions.forEach(action => store.dispatch(action));

        const state = store.getState();

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map
            .remove("maps")
            .setIn(["view", "in3DMode"], false)
            .setIn(["drawing", "isDrawingEnabled"], true)
            .setIn(["drawing", "geometryType"], appStrings.GEOMETRY_POLYGON)
            .setIn(["measuring", "isMeasuringEnabled"], false);
    });

    it('can enable drawing a circle on a 3D map', function() {
        const store = createStore(rootReducer, initialState);

        // initial map
        const initalActions = [
            mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D"),
            mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_3D)
        ];
        initalActions.forEach(action => store.dispatch(action));

        // retrieve map object
        const initialState = store.getState();
        const actualMap3D = initialState.map.get("maps").toJS()[appStrings.MAP_LIB_3D];

        // add drawing on the map
        actualMap3D.addDrawHandler(appStrings.GEOMETRY_CIRCLE, () => {}, appStrings.INTERACTION_DRAW);

        // enable drawing
        const finalActions = [
            mapActions.enableDrawing(appStrings.GEOMETRY_CIRCLE)
        ];
        finalActions.forEach(action => store.dispatch(action));

        const state = store.getState();

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map
            .remove("maps")
            .setIn(["view", "in3DMode"], true)
            .setIn(["drawing", "isDrawingEnabled"], true)
            .setIn(["drawing", "geometryType"], appStrings.GEOMETRY_CIRCLE)
            .setIn(["measuring", "isMeasuringEnabled"], false);

        TestUtil.compareFullStates(actual, expected);
    });

    it('can enable drawing a line on a 3D map', function() {
        const store = createStore(rootReducer, initialState);

        // initial map
        const initalActions = [
            mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D"),
            mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_3D)
        ];
        initalActions.forEach(action => store.dispatch(action));

        // retrieve map object
        const initialState = store.getState();
        const actualMap3D = initialState.map.get("maps").toJS()[appStrings.MAP_LIB_3D];

        // add drawing on the map
        actualMap3D.addDrawHandler(appStrings.GEOMETRY_LINE_STRING, () => {}, appStrings.INTERACTION_DRAW);

        // enable drawing
        const finalActions = [
            mapActions.enableDrawing(appStrings.GEOMETRY_LINE_STRING)
        ];
        finalActions.forEach(action => store.dispatch(action));

        const state = store.getState();

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map
            .remove("maps")
            .setIn(["view", "in3DMode"], true)
            .setIn(["drawing", "isDrawingEnabled"], true)
            .setIn(["drawing", "geometryType"], appStrings.GEOMETRY_LINE_STRING)
            .setIn(["measuring", "isMeasuringEnabled"], false);

        TestUtil.compareFullStates(actual, expected);
    });

    it('can enable drawing a polygon on a 3D map', function() {
        const store = createStore(rootReducer, initialState);

        // initial map
        const initalActions = [
            mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D"),
            mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_3D)
        ];
        initalActions.forEach(action => store.dispatch(action));

        // retrieve map object
        const initialState = store.getState();
        const actualMap3D = initialState.map.get("maps").toJS()[appStrings.MAP_LIB_3D];

        // add drawing on the map
        actualMap3D.addDrawHandler(appStrings.GEOMETRY_POLYGON, () => {}, appStrings.INTERACTION_DRAW);

        // enable drawing
        const finalActions = [
            mapActions.enableDrawing(appStrings.GEOMETRY_POLYGON)
        ];
        finalActions.forEach(action => store.dispatch(action));

        const state = store.getState();

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map
            .remove("maps")
            .setIn(["view", "in3DMode"], true)
            .setIn(["drawing", "isDrawingEnabled"], true)
            .setIn(["drawing", "geometryType"], appStrings.GEOMETRY_POLYGON)
            .setIn(["measuring", "isMeasuringEnabled"], false);

        TestUtil.compareFullStates(actual, expected);
    });

    it('can disable drawing on a 2D map and clear previous drawing type', function() {
        const store = createStore(rootReducer, initialState);

        // initial map
        const initalActions = [
            mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
            mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_2D)
        ];
        initalActions.forEach(action => store.dispatch(action));

        // retrieve map object
        const initialState = store.getState();
        const actualMap2D = initialState.map.get("maps").toJS()[appStrings.MAP_LIB_2D];

        // add drawing on the map
        actualMap2D.addDrawHandler(appStrings.GEOMETRY_POLYGON, () => {}, appStrings.INTERACTION_DRAW);

        // enable drawing
        const finalActions = [
            mapActions.enableDrawing(appStrings.GEOMETRY_POLYGON),
            mapActions.disableDrawing()
        ];
        finalActions.forEach(action => store.dispatch(action));

        const state = store.getState();

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map
            .remove("maps")
            .setIn(["view", "in3DMode"], false)
            .setIn(["drawing", "isDrawingEnabled"], false)
            .setIn(["drawing", "geometryType"], "")
            .setIn(["measuring", "isMeasuringEnabled"], false);

        TestUtil.compareFullStates(actual, expected);
    });

    it('can disable drawing on a 3D map and clear previous drawing type', function() {
        const store = createStore(rootReducer, initialState);

        // initial map
        const initalActions = [
            mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D"),
            mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_3D)
        ];
        initalActions.forEach(action => store.dispatch(action));

        // retrieve map object
        const initialState = store.getState();
        const actualMap3D = initialState.map.get("maps").toJS()[appStrings.MAP_LIB_3D];

        // add drawing on the map
        actualMap3D.addDrawHandler(appStrings.GEOMETRY_POLYGON, () => {}, appStrings.INTERACTION_DRAW);

        // enable drawing
        const finalActions = [
            mapActions.enableDrawing(appStrings.GEOMETRY_POLYGON),
            mapActions.disableDrawing()
        ];
        finalActions.forEach(action => store.dispatch(action));

        const state = store.getState();

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map
            .remove("maps")
            .setIn(["view", "in3DMode"], true)
            .setIn(["drawing", "isDrawingEnabled"], false)
            .setIn(["drawing", "geometryType"], "")
            .setIn(["measuring", "isMeasuringEnabled"], false);

        TestUtil.compareFullStates(actual, expected);
    });

    it('can add geometry to 2D map', function() {
        const store = createStore(rootReducer, initialState);

        // initial map
        const initalActions = [
            mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
            mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_3D)
        ];
        initalActions.forEach(action => store.dispatch(action));

        // retrieve map object
        const initialState = store.getState();
        const actualMap2D = initialState.map.get("maps").toJS()[appStrings.MAP_LIB_2D];

        // Create dummy geometry
        let geometryCircle = {
            type: appStrings.GEOMETRY_CIRCLE,
            coordinateType: appStrings.COORDINATE_TYPE_CARTOGRAPHIC,
            proj: actualMap2D.map.getView().getProjection().getCode(),
            center: {
                lon: 0,
                lat: 0
            },
            radius: 100,
            id: Math.random()
        };

        let geometryLineString = {
            type: appStrings.GEOMETRY_LINE_STRING,
            coordinateType: appStrings.COORDINATE_TYPE_CARTOGRAPHIC,
            proj: actualMap2D.map.getView().getProjection().getCode(),
            coordinates: [{
                lon: 0,
                lat: 0
            }, {
                lon: 10,
                lat: 10
            }, {
                lon: 20,
                lat: -20
            }],
            id: Math.random()
        };

        let geometryPolygon = {
            type: appStrings.GEOMETRY_POLYGON,
            coordinateType: appStrings.COORDINATE_TYPE_CARTOGRAPHIC,
            proj: actualMap2D.map.getView().getProjection().getCode(),
            coordinates: [{
                lon: 0,
                lat: 0
            }, {
                lon: 10,
                lat: 10
            }, {
                lon: 20,
                lat: -20
            }],
            id: Math.random()
        };

        // add geometries
        const finalActions = [
            mapActions.addGeometryToMap(geometryCircle, appStrings.INTERACTION_DRAW),
            mapActions.addGeometryToMap(geometryLineString, appStrings.INTERACTION_DRAW),
            mapActions.addGeometryToMap(geometryPolygon, appStrings.INTERACTION_DRAW)
        ];
        finalActions.forEach(action => store.dispatch(action));

        const state = store.getState();

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map
            .remove("maps")
            .setIn(["view", "in3DMode"], true)
            .setIn(["drawing", "geometryType"], "");


        let mapLayers = actualMap2D.map.getLayers().getArray();
        let mapLayer = MiscUtil.findObjectInArray(mapLayers, "_layerId", "_vector_drawings");
        let mapLayerFeatures = mapLayer.getSource().getFeatures();
        let drawFeatures = mapLayerFeatures.filter(x => x.get('interactionType') === appStrings.INTERACTION_DRAW);
        expect(drawFeatures.length).to.equal(3);
        TestUtil.compareFullStates(actual, expected);
    });

    it('can add geometry to 3D map', function() {
        const store = createStore(rootReducer, initialState);

        // initial map
        const initalActions = [
            mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D"),
            mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_2D)
        ];
        initalActions.forEach(action => store.dispatch(action));

        // retrieve map object
        const initialState = store.getState();
        const actualMap3D = initialState.map.get("maps").toJS()[appStrings.MAP_LIB_3D];

        // Create dummy geometry
        let geometryCircle = {
            type: appStrings.GEOMETRY_CIRCLE,
            coordinateType: appStrings.COORDINATE_TYPE_CARTOGRAPHIC,
            proj: appStrings.PROJECTIONS.latlon.code,
            center: {
                lon: 0,
                lat: 0
            },
            radius: 100,
            id: Math.random()
        };

        let geometryLineString = {
            type: appStrings.GEOMETRY_LINE_STRING,
            coordinateType: appStrings.COORDINATE_TYPE_CARTOGRAPHIC,
            proj: appStrings.PROJECTIONS.latlon.code,
            coordinates: [{
                lon: 0,
                lat: 0
            }, {
                lon: 10,
                lat: 10
            }, {
                lon: 20,
                lat: -20
            }],
            id: Math.random()
        };

        let geometryPolygon = {
            type: appStrings.GEOMETRY_POLYGON,
            coordinateType: appStrings.COORDINATE_TYPE_CARTOGRAPHIC,
            proj: appStrings.PROJECTIONS.latlon.code,
            coordinates: [{
                lon: 0,
                lat: 0
            }, {
                lon: 10,
                lat: 10
            }, {
                lon: 20,
                lat: -20
            }],
            id: Math.random()
        };

        // add geometries
        const finalActions = [
            mapActions.addGeometryToMap(geometryCircle, appStrings.INTERACTION_DRAW),
            mapActions.addGeometryToMap(geometryLineString, appStrings.INTERACTION_DRAW),
            mapActions.addGeometryToMap(geometryPolygon, appStrings.INTERACTION_DRAW)
        ];
        finalActions.forEach(action => store.dispatch(action));

        const state = store.getState();

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map
            .remove("maps")
            .setIn(["view", "in3DMode"], false)
            .setIn(["drawing", "geometryType"], "");

        let drawFeatures = actualMap3D.map.scene.primitives._primitives.filter(x => x._interactionType === appStrings.INTERACTION_DRAW);
        expect(drawFeatures.length).to.equal(3);
        TestUtil.compareFullStates(actual, expected);
    });

    it('can remove all drawings from 2D and 3D maps', function() {
        const store = createStore(rootReducer, initialState);

        // initial map
        const initalActions = [
            mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
            mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D"),
            mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_3D)
        ];
        initalActions.forEach(action => store.dispatch(action));

        // retrieve map object
        const initialState = store.getState();
        const actualMap2D = initialState.map.get("maps").toJS()[appStrings.MAP_LIB_2D];
        const actualMap3D = initialState.map.get("maps").toJS()[appStrings.MAP_LIB_3D];

        // Create dummy geometry
        let geometryCircle = {
            type: appStrings.GEOMETRY_CIRCLE,
            coordinateType: appStrings.COORDINATE_TYPE_CARTOGRAPHIC,
            proj: actualMap2D.map.getView().getProjection().getCode(),
            center: {
                lon: 0,
                lat: 0
            },
            radius: 100,
            id: Math.random()
        };

        // add geometries to 2D and 3D maps
        const nextActions = [
            mapActions.addGeometryToMap(geometryCircle, appStrings.INTERACTION_DRAW),
            mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_2D),
            mapActions.addGeometryToMap(geometryCircle, appStrings.INTERACTION_DRAW),
            mapActions.removeAllDrawings()
        ];
        nextActions.forEach(action => store.dispatch(action));

        const state = store.getState();

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map
            .remove("maps")
            .setIn(["view", "in3DMode"], false)
            .setIn(["drawing", "geometryType"], "");


        // Get 2D drawings
        let mapLayers = actualMap2D.map.getLayers().getArray();
        let mapLayer = MiscUtil.findObjectInArray(mapLayers, "_layerId", "_vector_drawings");
        let mapLayerFeatures = mapLayer.getSource().getFeatures();
        let drawFeatures2D = mapLayerFeatures.filter(x => x.get('interactionType') === appStrings.INTERACTION_DRAW);
        
        // Get 3D drawings
        let drawFeatures3D = actualMap3D.map.scene.primitives._primitives.filter(x => x._interactionType === appStrings.INTERACTION_DRAW);
        expect(drawFeatures2D.length).to.equal(0);
        expect(drawFeatures3D.length).to.equal(0);
        TestUtil.compareFullStates(actual, expected);
    });

    it('can add measurement label to geometry on 2D and 3D maps', function(done) {
        const store = createStore(rootReducer, initialState);

        // initial map
        const initalActions = [
            mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
            mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D"),
            mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_3D)
        ];
        initalActions.forEach(action => store.dispatch(action));

        // retrieve map object
        const initialState = store.getState();
        const actualMap2D = initialState.map.get("maps").toJS()[appStrings.MAP_LIB_2D];
        const actualMap3D = initialState.map.get("maps").toJS()[appStrings.MAP_LIB_3D];

        // Create dummy geometry
        let geometryLineString = {
            type: appStrings.GEOMETRY_LINE_STRING,
            coordinateType: appStrings.COORDINATE_TYPE_CARTOGRAPHIC,
            proj: actualMap2D.map.getView().getProjection().getCode(),
            coordinates: [{
                lon: 0,
                lat: 0
            }, {
                lon: 10,
                lat: 10
            }, {
                lon: 20,
                lat: -20
            }],
            id: Math.random()
        };

        // add geometries to 2D and 3D maps and then add label
        const finalActions = [
            mapActions.addGeometryToMap(geometryLineString, appStrings.INTERACTION_DRAW),
            mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_2D),
            mapActions.addGeometryToMap(geometryLineString, appStrings.INTERACTION_DRAW),
            mapActions.addMeasurementLabelToGeometry(geometryLineString, appStrings.MEASURE_DISTANCE, 'metric')
        ];
        finalActions.forEach(action => store.dispatch(action));

        setTimeout(() => {
            const state = store.getState();

            const actual = {...state };
            actual.map = actual.map.remove("maps");

            const expected = {...initialState };
            expected.map = expected.map
                .remove("maps")
                .setIn(["view", "in3DMode"], false)
                .setIn(["drawing", "geometryType"], "");

            // Get 2D overlays
            let overlays2D = actualMap2D.map.getOverlays().getArray();
            
            // Get 3D overlays
            let overlays3D = actualMap3D.map.entities.values;

            expect(overlays2D.length).to.equal(1);
            expect(overlays3D.length).to.equal(1);
            TestUtil.compareFullStates(actual, expected);
            done();
        }, 500);
    });

    it('can remove all measurements in 2D and 3D maps', function() {
        const store = createStore(rootReducer, initialState);

        // initial map
        const initalActions = [
            mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
            mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D"),
            mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_3D)
        ];
        initalActions.forEach(action => store.dispatch(action));

        // retrieve map object
        const initialState = store.getState();
        const actualMap2D = initialState.map.get("maps").toJS()[appStrings.MAP_LIB_2D];
        const actualMap3D = initialState.map.get("maps").toJS()[appStrings.MAP_LIB_3D];

        // Create dummy geometry
        let geometryLineString = {
            type: appStrings.GEOMETRY_LINE_STRING,
            coordinateType: appStrings.COORDINATE_TYPE_CARTOGRAPHIC,
            proj: actualMap2D.map.getView().getProjection().getCode(),
            coordinates: [{
                lon: 0,
                lat: 0
            }, {
                lon: 10,
                lat: 10
            }, {
                lon: 20,
                lat: -20
            }],
            id: Math.random()
        };

        // add geometries to 2D and 3D maps and then add label
        const finalActions = [
            mapActions.addGeometryToMap(geometryLineString, appStrings.INTERACTION_DRAW),
            mapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_2D),
            mapActions.addGeometryToMap(geometryLineString, appStrings.INTERACTION_DRAW),
            mapActions.addMeasurementLabelToGeometry(geometryLineString, appStrings.MEASURE_DISTANCE, 'metric'),
            mapActions.removeAllMeasurements()
        ];
        finalActions.forEach(action => store.dispatch(action));

        const state = store.getState();

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map
            .remove("maps")
            .setIn(["view", "in3DMode"], false)
            .setIn(["drawing", "geometryType"], "");


        // Get 2D overlays
        let overlays2D = actualMap2D.map.getOverlays().getArray();
        
        // Get 3D overlays
        let overlays3D = actualMap3D.map.entities.values;

        expect(overlays2D.length).to.equal(0);
        expect(overlays3D.length).to.equal(0);
        TestUtil.compareFullStates(actual, expected);
    });

    it('can injest wmts and json layer configurations as well as palette configurations. Big test.', function(done) {
        // adjust default timeout
        this.timeout(2000);

        // create store with async action support
        const store = createStore(rootReducer, initialState, compose(applyMiddleware(thunkMiddleware)));

        const actions = [
            layerActions.loadInitialData()
        ];
        actions.forEach(action => store.dispatch(action));

        setTimeout(() => {
            const state = store.getState();
            const actual = {...state };
            actual.map = actual.map.remove("maps");

            const expected = {...initialState };
            expected.map = expected.map
                .remove("maps")
                .set("palettes", mapState.get("palettes").merge(initialIngest.PALETTES))
                .set("layers", mapState.get("layers").merge(initialIngest.LAYERS))
                .removeIn(["layers", "partial"]);
            expected.asyncronous = expected.asyncronous
                .set("loadingInitialData", false)
                .set("initialLoadingAttempted", true)
                .set("loadingLayerSources", false)
                .set("layerLoadingAttempted", true)
                .set("loadingLayerPalettes", false)
                .set("paletteLoadingAttempted", true);

            TestUtil.compareFullStates(actual, expected);
            done();
        }, 1000);
    });

    it('can activate layers', function() {
        // create modified state to account for layer ingest
        const modifiedState = {...initialState };
        modifiedState.map = modifiedState.map
            .set("layers", mapState.get("layers").merge(initialIngest.LAYERS))
            .removeIn(["layers", "partial"]);

        const store = createStore(rootReducer, modifiedState);

        const actions = [
            mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
            mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D"),
            layerActions.setLayerActive("facilities_kml", true),
            layerActions.setLayerActive("GHRSST_L4_G1SST_Sea_Surface_Temperature", true)
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map
            .remove("maps")
            .set("layers", mapState.get("layers").merge(activateInactivateLayers.ACTIVE_LAYERS))
            .removeIn(["layers", "partial"]);

        TestUtil.compareFullStates(actual, expected);
    });

    it('can deactivate layers', function() {
        // create modified state to account for layer ingest
        const modifiedState = {...initialState };
        modifiedState.map = modifiedState.map
            .set("layers", mapState.get("layers").merge(initialIngest.LAYERS))
            .removeIn(["layers", "partial"]);

        const store = createStore(rootReducer, modifiedState);

        const actions = [
            mapActions.initializeMap(appStrings.MAP_LIB_2D, "map2D"),
            mapActions.initializeMap(appStrings.MAP_LIB_3D, "map3D"),
            layerActions.setLayerActive("facilities_kml", true),
            layerActions.setLayerActive("GHRSST_L4_G1SST_Sea_Surface_Temperature", true),
            layerActions.setLayerActive("facilities_kml", false)
        ];
        actions.forEach(action => store.dispatch(action));

        const state = store.getState();

        const actual = {...state };
        actual.map = actual.map.remove("maps");

        const expected = {...initialState };
        expected.map = expected.map
            .remove("maps")
            .set("layers", mapState.get("layers").merge(activateInactivateLayers.INACTIVE_LAYERS))
            .removeIn(["layers", "partial"]);

        TestUtil.compareFullStates(actual, expected);
    });
});
