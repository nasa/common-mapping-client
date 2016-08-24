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
            dateSlider: dateSliderState
        };

        expect(actual.view.toJS()).to.deep.equal(expected.view.toJS());
        expect(actual.asyncronous.toJS()).to.deep.equal(expected.asyncronous.toJS());
        expect(actual.help.toJS()).to.deep.equal(expected.help.toJS());
        expect(actual.settings.toJS()).to.deep.equal(expected.settings.toJS());
        expect(actual.share.toJS()).to.deep.equal(expected.share.toJS());
        expect(actual.analytics.remove("currentBatch").remove("timeLastSent").toJS()).to.deep.equal(expected.analytics.remove("currentBatch").remove("timeLastSent").toJS());
        expect(actual.map.remove("maps").toJS()).to.deep.equal(expected.map.toJS());
        expect(actual.dateSlider.toJS()).to.deep.equal(expected.dateSlider.toJS());
    });
    it('does nothing on a NO_ACTION', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            { type: actionTypes.NO_ACTION }
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
            dateSlider: dateSliderState
        };

        expect(actual.view.toJS()).to.deep.equal(expected.view.toJS());
        expect(actual.asyncronous.toJS()).to.deep.equal(expected.asyncronous.toJS());
        expect(actual.help.toJS()).to.deep.equal(expected.help.toJS());
        expect(actual.settings.toJS()).to.deep.equal(expected.settings.toJS());
        expect(actual.share.toJS()).to.deep.equal(expected.share.toJS());
        expect(actual.analytics.remove("currentBatch").remove("timeLastSent").toJS()).to.deep.equal(expected.analytics.remove("currentBatch").remove("timeLastSent").toJS());
        expect(actual.map.remove("maps").toJS()).to.deep.equal(expected.map.toJS());
        expect(actual.dateSlider.toJS()).to.deep.equal(expected.dateSlider.toJS());
    });
});
