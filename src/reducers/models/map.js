import Immutable from "immutable";
import { mapState as mapStateCore, layerModel as layerModelCore } from "_core/reducers/models/map";

export const mapState = mapStateCore.mergeDeep(
    Immutable.fromJS({
        view: {
            pixelHoverCoordinate: {
                data: [],
                showData: true
            },
            pixelClickCoordinate: {
                data: []
            },
            pixelDragCoordinate: {
                data: []
            }
        }
    })
);

export const layerModel = layerModelCore.mergeDeep({
    vectorStyle: undefined,
    mapping: {
        title: undefined,
        subtitle: undefined,
        properties: {},
        data: undefined
    },
    updateParameters: { time: true, bbox: false, filters: {} }
});
