/*global INCLUDE_CORE_TESTS*/
import "babel-polyfill";
import TestUtil from "_core/tests/TestUtil";
import { CacheSpec } from "_core/tests/Cache.spec";
import { MapUtilSpec } from "_core/tests/MapUtil.spec";
import { MiscUtilSpec } from "_core/tests/MiscUtil.spec";
import { StoreAnalyticsSpec } from "_core/tests/store.analytics.spec";
import { StoreAsyncSpec } from "_core/tests/store.async.spec";
import { StoreDateSliderSpec } from "_core/tests/store.dateSlider.spec";
import { StoreHelpSpec } from "_core/tests/store.help.spec";
import { StoreLayerInfoSpec } from "_core/tests/store.layerInfo.spec";
import { StoreMapSpec } from "_core/tests/store.map.spec";
import { StoreSettingsSpec } from "_core/tests/store.settings.spec";
import { StoreShareSpec } from "_core/tests/store.share.spec";
import { StoreSpec } from "_core/tests/store.spec";
import { StoreViewSpec } from "_core/tests/store.view.spec";
import { expect } from "chai";
import Immutable from "immutable";

//// Override any core tests here
//// MiscUtilSpec Overrides Examples

// Override a test
// MiscUtilSpec.tests.generateStringFromSet.test2 = () => {
//     it('OVERRIDE test2: blah blah', () => {
//         expect(1).to.be.true;
//     });
// }
// Disable a test
// MiscUtilSpec.generateStringFromSet.test3 = () => {};

// Disable a test set
// MiscUtilSpec.findObjectInArray = {};

// Run core tests
const testSuites = [
    CacheSpec,
    MiscUtilSpec,
    MapUtilSpec,
    StoreAnalyticsSpec,
    StoreAsyncSpec,
    StoreDateSliderSpec,
    StoreHelpSpec,
    StoreLayerInfoSpec,
    StoreMapSpec,
    StoreSettingsSpec,
    StoreShareSpec,
    StoreSpec,
    StoreViewSpec
];

if (INCLUDE_CORE_TESTS) {
    testSuites.map(testSuite => TestUtil.runTestSuite(testSuite));
}
