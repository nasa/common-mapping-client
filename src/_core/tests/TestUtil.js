/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/*global NO_WEB_GL*/
import { expect } from "chai";

export default class TestUtil {
    static compareFullStates(actual, expected, includeAnalytics = false, includeAlerts = false) {
        for (let key in actual) {
            if (actual.hasOwnProperty(key)) {
                if (
                    (key !== "alerts" || includeAlerts) &&
                    (key !== "analytics" || includeAnalytics)
                ) {
                    expect(actual[key].toJS()).to.deep.equal(expected[key].toJS());
                }
            }
        }
    }

    static skipIfNoWebGL(test, _this, done) {
        if (NO_WEB_GL) {
            console.log("Skipping test:", test);
            _this.skip();
            if (done) {
                done();
            }
        }
        return NO_WEB_GL;
    }

    static runTestSuite(testSuite) {
        // Run an array of Core test sets with Mocha and execute the beforeEach and
        // afterEach functions if defined.
        Object.keys(testSuite.tests).map(testSet => {
            describe("_core." + testSuite.name + " -> " + testSet + " ->", () => {
                if (testSuite.beforeEach) {
                    testSuite.beforeEach();
                }
                if (testSuite.afterEach) {
                    testSuite.afterEach();
                }
                Object.keys(testSuite.tests[testSet]).map(test => testSuite.tests[testSet][test]());
            });
        });
    }
}
