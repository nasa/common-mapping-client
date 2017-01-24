import { expect } from 'chai';

export default class TestUtil {
    static compareFullStates(actual, expected, includeAnalytics = false, includeAlerts = false) {
        for(let key in actual) {
            if(actual.hasOwnProperty(key)) {
                if((key !== "alerts" || includeAlerts) && (key !== "analytics" || includeAnalytics)) {
                    expect(actual[key].toJS()).to.deep.equal(expected[key].toJS());
                }
            }
        }
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
