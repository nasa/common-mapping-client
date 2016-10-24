//IMPORTANT: Note that with Redux, state should NEVER be changed.
//State is considered immutable. Instead,
//create a copy of the state passed and set new values on the copy.

export default class LayerInfoReducer {
    openLayerInfo(state, action){
        return state.set("isOpen", true).set("layer", action.layer);
    }

    closeLayerInfo(state, action){
        return state.set("isOpen", false);
    }
}