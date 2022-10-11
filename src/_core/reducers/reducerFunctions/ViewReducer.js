/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import MiscUtil from "_core/utils/MiscUtil";
import * as appStrings from "_core/constants/appStrings";
import { alert } from "_core/reducers/models/alert";

//IMPORTANT: Note that with Redux, state should NEVER be changed.
//State is considered immutable. Instead,
//create a copy of the state passed and set new values on the copy.

export default class ViewReducer {
    static miscUtil = MiscUtil;

    static checkBrowserFunctionalities(state, action) {
        // Here we check for any missing browser functionalities that we
        // want to alert the user about. Note, Modernizr checks are used elsewhere
        // but those are not intended to inform the user that functionality is missing
        let alerts = state.get("alerts");
        // if (!Modernizr.fullscreen) {
        //     alerts = alerts.push(
        //         alert.merge({
        //             title: appStrings.ALERTS.BROWSER_FUNCTIONALITY_MISSING.title,
        //             body: appStrings.ALERTS.BROWSER_FUNCTIONALITY_MISSING.formatString
        //                 .replace("{FUNCTIONALITY}", "Fullscreen")
        //                 .replace(
        //                     "{SYMPTOM}",
        //                     "This application will not be able to enter fullscreen mode"
        //                 ),
        //             severity: 2,
        //             time: new Date()
        //         })
        //     );
        // }
        // if (!Modernizr.webgl) {
        //     alerts = alerts.push(
        //         alert.merge({
        //             title: appStrings.ALERTS.BROWSER_FUNCTIONALITY_MISSING.title,
        //             body: appStrings.ALERTS.BROWSER_FUNCTIONALITY_MISSING.formatString
        //                 .replace("{FUNCTIONALITY}", "WebGL")
        //                 .replace(
        //                     "{SYMPTOM}",
        //                     "This application will not be able to use the 3D map"
        //                 ),
        //             severity: 3,
        //             time: new Date()
        //         })
        //     );
        // }
        return state.set("alerts", alerts);
    }

    static completeInitialLoad(state, action) {
        return state.set("initialLoadComplete", true);
    }

    static setLayerMenuOpen(state, action) {
        return state.set("layerMenuOpen", action.open);
    }

    static dismissAlert(state, action) {
        let remAlert = action.alert;
        return state.set(
            "alerts",
            state.get("alerts").filter((alert) => {
                return alert !== remAlert;
            })
        );
    }

    static dismissAllAlerts(state, action) {
        return state.set("alerts", state.get("alerts").clear());
    }

    static setFullScreen(state, action) {
        if (action.enabled) {
            this.miscUtil.enterFullScreen();
        } else {
            this.miscUtil.exitFullscreen();
        }
        return state.set("isFullscreen", action.enabled);
    }

    static resetApplicationState(state, action) {
        state = this.setLayerMenuOpen(state, { open: true });
        return state.set("appResetCounter", state.get("appResetCounter") + 1);
    }

    static setDistractionFreeMode(state, action) {
        return state.set("distractionFreeMode", action.enabled);
    }

    static setMapControlsToolsOpen(state, action) {
        return state.set("mapControlsToolsOpen", action.open);
    }

    static setMapControlsBasemapPickerOpen(state, action) {
        return state.set("mapControlsBasemapPickerOpen", action.open);
    }

    static hideMapControls(state, action) {
        return state.set("mapControlsHidden", action.hidden);
    }
}
