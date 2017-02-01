import * as AppActions from '_core/actions/AppActions';
import * as MapActions from '_core/actions/MapActions';
import * as DateSliderActions from '_core/actions/DateSliderActions';
import * as actionTypes from '_core/constants/actionTypes';
import * as appStrings from '_core/constants/appStrings';
import appConfig from 'constants/appConfig';
import { createStore } from 'redux';
import { expect } from 'chai';
import rootReducer from '_core/reducers';
import { mapState, layerModel, paletteModel } from '_core/reducers/models/map';
import { asyncState } from '_core/reducers/models/async';
import { helpState } from '_core/reducers/models/help';
import { shareState } from '_core/reducers/models/share';
import { settingsState } from '_core/reducers/models/settings';
import { dateSliderState } from '_core/reducers/models/dateSlider';
import { analyticsState } from '_core/reducers/models/analytics';
import { viewState } from '_core/reducers/models/view';
import { layerInfoState } from '_core/reducers/models/layerInfo';
import TestUtil from '_core/tests/TestUtil';

const initialState = {
    map: mapState,
    view: viewState,
    asynchronous: asyncState,
    help: helpState,
    settings: settingsState,
    share: shareState,
    dateSlider: dateSliderState,
    analytics: analyticsState,
    layerInfo: layerInfoState
};

export const StoreSpec = {
    name: "StoreSpec",
    tests: {
        default: {
            test1: () => {
                it('resets application state correctly', function() {
                    const store = createStore(rootReducer, initialState);

                    const actions = [
                        MapActions.initializeMap(appStrings.MAP_LIB_2D),
                        MapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_3D),
                        MapActions.zoomIn(),
                        MapActions.addGeometryToMap({
                            type: appStrings.GEOMETRY_CIRCLE,
                            center: { lon: 0, lat: 0 },
                            radius: 500,
                            coordinateType: appStrings.COORDINATE_TYPE_CARTOGRAPHIC
                        }),
                        MapActions.removeAllDrawings(),
                        MapActions.removeAllMeasurements(),
                        MapActions.setMapViewMode(appStrings.MAP_VIEW_MODE_2D),
                        MapActions.addGeometryToMap({
                            type: appStrings.GEOMETRY_CIRCLE,
                            center: { lon: 10, lat: -20 },
                            radius: 52200,
                            coordinateType: appStrings.COORDINATE_TYPE_CARTOGRAPHIC
                        }),
                        MapActions.zoomIn(),
                        MapActions.setTerrainEnabled(false),
                        MapActions.setTerrainExaggeration(appConfig.TERRAIN_EXAGGERATION_OPTIONS[1].value),
                        MapActions.setScaleUnits(appConfig.SCALE_OPTIONS[1].value),
                        MapActions.zoomOut(),
                        MapActions.resetOrientation(0),
                        DateSliderActions.setDateResolution(appConfig.DATE_SLIDER_RESOLUTIONS.MONTHS),
                        AppActions.resetApplicationState()
                    ];

                    actions.forEach(action => store.dispatch(action));

                    const actual = store.getState();
                    actual.map = actual.map.remove("maps");

                    const expected = {...initialState };
                    expected.map = expected.map.remove("maps");

                    TestUtil.compareFullStates(actual, expected);
                });
            },

            test2: () => {
                it('does nothing on a NO_ACTION', function() {
                    const store = createStore(rootReducer, initialState);

                    const actions = [
                        { type: actionTypes.NO_ACTION }
                    ];
                    actions.forEach(action => store.dispatch(action));

                    const actual = store.getState();

                    const expected = {...initialState };

                    TestUtil.compareFullStates(actual, expected);
                });
            }
        }
    }
}
