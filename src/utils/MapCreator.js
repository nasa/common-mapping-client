/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import * as appStrings from "_core/constants/appStrings";
import MapWrapperOpenlayers from "utils/MapWrapperOpenlayers";
import MapWrapperCesium from "utils/MapWrapperCesium";

// creates a new object that abstracts a mapping library
/**
 * Creates a object that abstracts a mapping library
 *
 * @export
 * @param {string} type signifying the type of map to create, and thus backing library to use
 * @param {DOMNode|string} container the dom node to render the map to
 * @param {object} mapOptions the set of options to pass to the wrapper
 * @returns a MapWrapper instance
 */
export function createMap(type, container, mapOptions) {
    switch (type) {
        case appStrings.MAP_LIB_2D:
            return new MapWrapperOpenlayers(container, mapOptions);
        case appStrings.MAP_LIB_3D:
            return new MapWrapperCesium(container, mapOptions);
        default:
            return false;
    }
}
