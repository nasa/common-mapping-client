/*global SKIP_WEBGL_TESTS*/
import { expect } from 'chai';

export default class TestUtil {
    static compareFullStates(actual, expected, includeAnalytics = false, includeAlerts = false) {
        for (let key in actual) {
            if (actual.hasOwnProperty(key)) {
                if ((key !== "alerts" || includeAlerts) && (key !== "analytics" || includeAnalytics)) {
                    expect(actual[key].toJS()).to.deep.equal(expected[key].toJS());
                }
            }
        }
    }

    static skipIfNoWebGL(test, _this, done) {
        if (SKIP_WEBGL_TESTS) {
            console.log("Skipping test:", test)
            _this.skip();
            if (done) {
                done();
            }
        }
        return SKIP_WEBGL_TESTS;
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
