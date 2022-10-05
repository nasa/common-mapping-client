/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
/* MAP */
export const LAYER_URL_PARAMETER_CHECKBOX = "checkbox";
export const LAYER_URL_PARAMETER_SELECT = "select";

export const LAYER_VECTOR_GEOJSON_RASTER = "vector_geojson_raster";

export const VECTOR_STYLE_VERTICAL_PROFILE = "profile";
export const VECTOR_STYLE_TIMESERIE = "timeserie";
export const VECTOR_STYLE_TRAJECTORY = "trajectory";

// event types
export const EVENT_MOUSE_DRAG = "mousedrag";

/* ALERTS */
export const ALERTS = {
    SET_PARAMETER_FAILED: {
        title: "Parameter Update Failed",
        formatString: "Setting {PARAMETER} in the {MAP} map failed.",
        severity: 2
    }
};
/* END ALERTS */
