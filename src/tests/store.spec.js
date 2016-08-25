import * as AppActions from '../actions/AppActions';
import * as MapActions from '../actions/MapActions';
import * as DateSliderActions from '../actions/DateSliderActions';
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

describe('Store', function() {
    it('resets application state correctly', function() {
        const store = createStore(rootReducer, initialState);

        const actions = [
            MapActions.initializeMap(mapStrings.MAP_LIB_2D),
            MapActions.setMapViewMode(mapStrings.MAP_VIEW_MODE_3D),
            MapActions.zoomIn(),
            MapActions.addGeometryToMap({
                type: mapStrings.GEOMETRY_CIRCLE,
                center: { lon: 0, lat: 0 },
                radius: 500,
                coordinateType: mapStrings.COORDINATE_TYPE_CARTOGRAPHIC
            }),
            MapActions.removeAllGeometries(),
            MapActions.setMapViewMode(mapStrings.MAP_VIEW_MODE_2D),
            MapActions.addGeometryToMap({
                type: mapStrings.GEOMETRY_CIRCLE,
                center: { lon: 10, lat: -20 },
                radius: 52200,
                coordinateType: mapStrings.COORDINATE_TYPE_CARTOGRAPHIC
            }),
            MapActions.zoomIn(),
            MapActions.setTerrainEnabled(false),
            MapActions.setScaleUnits(mapConfig.SCALE_OPTIONS[1].value),
            MapActions.zoomOut(),
            MapActions.resetOrientation(0),
            DateSliderActions.setSliderCollapsed(),
            DateSliderActions.setDateResolution(appStrings.DATE_SLIDER_RESOLUTIONS.MONTHS),
            AppActions.resetApplicationState()
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
            dateSlider: dateSliderState,
            layerInfo: layerInfoState
        };

        expect(actual.view.toJS()).to.deep.equal(expected.view.toJS());
        expect(actual.asyncronous.toJS()).to.deep.equal(expected.asyncronous.toJS());
        expect(actual.help.toJS()).to.deep.equal(expected.help.toJS());
        expect(actual.settings.toJS()).to.deep.equal(expected.settings.toJS());
        expect(actual.share.toJS()).to.deep.equal(expected.share.toJS());
        expect(actual.analytics.remove("currentBatch").remove("timeLastSent").toJS()).to.deep.equal(expected.analytics.remove("currentBatch").remove("timeLastSent").toJS());
        expect(actual.map.remove("maps").toJS()).to.deep.equal(expected.map.toJS());
        expect(actual.dateSlider.toJS()).to.deep.equal(expected.dateSlider.toJS());
        expect(actual.layerInfo.toJS()).to.deep.equal(expected.layerInfo.toJS());
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
            dateSlider: dateSliderState,
            layerInfo: layerInfoState
        };

        expect(actual.view.toJS()).to.deep.equal(expected.view.toJS());
        expect(actual.asyncronous.toJS()).to.deep.equal(expected.asyncronous.toJS());
        expect(actual.help.toJS()).to.deep.equal(expected.help.toJS());
        expect(actual.settings.toJS()).to.deep.equal(expected.settings.toJS());
        expect(actual.share.toJS()).to.deep.equal(expected.share.toJS());
        expect(actual.analytics.remove("currentBatch").remove("timeLastSent").toJS()).to.deep.equal(expected.analytics.remove("currentBatch").remove("timeLastSent").toJS());
        expect(actual.map.remove("maps").toJS()).to.deep.equal(expected.map.toJS());
        expect(actual.dateSlider.toJS()).to.deep.equal(expected.dateSlider.toJS());
        expect(actual.layerInfo.toJS()).to.deep.equal(expected.layerInfo.toJS());
    });
});
