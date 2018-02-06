/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

//IMPORTANT: Note that with Redux, state should NEVER be changed.
//State is considered immutable. Instead,
//create a copy of the state passed and set new values on the copy.

export default class LayerInfoReducer {
    static openLayerInfo(state, action) {
        return state
            .set("isOpen", true)
            .set("activeLayerId", action.layer.get("id"))
            .setIn(["metadata", "content"], null)
            .set("activeThumbnailUrl", action.layer.get("thumbnailImage"));
    }

    static closeLayerInfo(state, action) {
        return state.set("isOpen", false).set("activeLayerId", "");
    }

    static setCurrentMetadata(state, action) {
        if (state.get("activeLayerId") === action.layer.get("id")) {
            return state.setIn(["metadata", "content"], action.data);
        }
        return state;
    }
}
