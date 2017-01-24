import { expect } from 'chai';

export default class TestUtil {
    static compareFullStates(actual, expected, includeAnalytics = false) {
        expect(actual.view.toJS()).to.deep.equal(expected.view.toJS());
        expect(actual.map.toJS()).to.deep.equal(expected.map.toJS());
        expect(actual.asyncronous.toJS()).to.deep.equal(expected.asyncronous.toJS());
        expect(actual.help.toJS()).to.deep.equal(expected.help.toJS());
        expect(actual.settings.toJS()).to.deep.equal(expected.settings.toJS());
        expect(actual.share.toJS()).to.deep.equal(expected.share.toJS());
        expect(actual.dateSlider.toJS()).to.deep.equal(expected.dateSlider.toJS());
        expect(actual.layerInfo.toJS()).to.deep.equal(expected.layerInfo.toJS());

        if (includeAnalytics) {
            expect(actual.analytics.toJS()).to.deep.equal(expected.analytics.toJS());
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
