import { expect } from 'chai';
import Immutable from 'immutable';
import MiscUtil from '../utils/MiscUtil';

describe('Misc Utils', () => {
    describe('generateStringFromSet', () => {
        it('returns a space separated string from a set of strings mapped to booleans', () => {
            let varIn = {
                "foo": true,
                "bar": false,
                "fubar": true
            };
            let varOut = 'foo fubar';

            //assert
            expect(MiscUtil.generateStringFromSet(varIn)).to.equal(varOut);
        });

        it('handles only string booleans (true/false)', () => {
            let varIn = {
                "foo": 1,
                "bar": true,
                "fubar": "true"
            };
            let varOut = 'bar';

            //assert
            expect(MiscUtil.generateStringFromSet(varIn)).to.equal(varOut);
        });

        it('returns empty string if no strings map to true', () => {
            let varIn = {
                "foo": false,
                "bar": false,
                "fubar": false
            };
            let varOut = '';

            //assert
            expect(MiscUtil.generateStringFromSet(varIn)).to.equal(varOut);
        });
    });
    describe('findObjectInArray', () => {
        it('returns the first object in an array that has a matching key/value pair', () => {
            // DEFINE VARS
            let varIn = [{
                testkey: "testvalue",
                indexA: true
            }, {
                testkey: "testvalue",
                indexB: true
            }, {
                testkey: "testvalue",
                indexC: true
            }];
            let varOut = varIn[0];

            //assert
            expect(MiscUtil.findObjectInArray(varIn, "testkey", "testvalue")).to.equal(varOut);
        });
        it('returns false if a matching object is not found', () => {
            // DEFINE VARS
            let varIn = [{
                testkey: "testvalue",
                indexA: true
            }, {
                testkey: "testvalue",
                indexB: true
            }, {
                testkey: "testvalue",
                indexC: true
            }];
            let varOut = false;

            //assert
            expect(MiscUtil.findObjectInArray(varIn, "indexD", true)).to.equal(varOut);
        });
    });
    describe('findObjectWithIndexInArray', () => {
        it('returns an object containing the first object in an array that has a matching key/value pair and its index in the array', () => {
            // DEFINE VARS
            let varIn = [{
                testkey: "testvalue",
                indexA: true
            }, {
                testkey: "testvalue",
                indexB: true
            }, {
                testkey: "testvalue",
                indexC: true
            }];
            let varOut = {
                value: varIn[1],
                index: 1
            };

            //assert
            expect(MiscUtil.findObjectWithIndexInArray(varIn, "indexB", true)).to.deep.equal(varOut);
        });
        it('returns false if a matching object is not found', () => {
            // DEFINE VARS
            let varIn = [{
                testkey: "testvalue",
                indexA: true
            }, {
                testkey: "testvalue",
                indexB: true
            }, {
                testkey: "testvalue",
                indexC: true
            }];
            let varOut = false;

            //assert
            expect(MiscUtil.findObjectWithIndexInArray(varIn, "indexD", true)).to.equal(varOut);
        });
    });
    describe('getImmutableObjectSort', () => {
        it('takes a key and returns a sort function comparing that key for an Immutable List of Map objects.', () => {
            // DEFINE VARS
            let immutableArr = Immutable.fromJS([{
                index: 4,
                testkey: "testvalue"
            }, {
                index: 2,
                testkey: "testvalue"
            }, {
                index: 1,
                testkey: "testvalue"
            }, {
                index: 5,
                testkey: "testvalue"
            }, {
                index: 3,
                testkey: "testvalue"
            }]);
            let varIn = MiscUtil.getImmutableObjectSort("index");
            let varOut = [{
                index: 1,
                testkey: "testvalue"
            }, {
                index: 2,
                testkey: "testvalue"
            }, {
                index: 3,
                testkey: "testvalue"
            }, {
                index: 4,
                testkey: "testvalue"
            }, {
                index: 5,
                testkey: "testvalue"
            }];

            //assert
            expect(immutableArr.sort(varIn).toJS()).to.deep.equal(varOut);
        });
    });
    describe('getHexFromColorString', () => {
        it('returns a hex string from an rgb string with space separators', () => {
            // DEFINE VARS
            let varIn = "123 32 3";
            let varOut = "#7B2003";

            //assert
            expect(MiscUtil.getHexFromColorString(varIn)).to.equal(varOut);
        });

        it('returns a hex string from an rgb string with comma separators', () => {
            // DEFINE VARS
            let varIn = "123,32,3";
            let varOut = "#7B2003";

            //assert
            expect(MiscUtil.getHexFromColorString(varIn)).to.equal(varOut);
        });
        it('returns a hex string from an rgb string with comma space separators', () => {
            // DEFINE VARS
            let varIn = "123, 32, 3";
            let varOut = "#7B2003";

            //assert
            expect(MiscUtil.getHexFromColorString(varIn)).to.equal(varOut);
        });
        it('returns a hex string from an rgb string with an rgb wrapper', () => {
            // DEFINE VARS
            let varIn = "rgb(123,32,3)";
            let varOut = "#7B2003";

            //assert
            expect(MiscUtil.getHexFromColorString(varIn)).to.equal(varOut);
        });
        it('returns a capitalized hex string from a hex string', () => {
            // DEFINE VARS
            let varIn = "#7b2003";
            let varOut = "#7B2003";

            //assert
            expect(MiscUtil.getHexFromColorString(varIn)).to.equal(varOut);
        });
        it('returns a # prefixed hex string from a hex number', () => {
            // DEFINE VARS
            let varIn = "7b2003";
            let varOut = "#7B2003";

            //assert
            expect(MiscUtil.getHexFromColorString(varIn)).to.equal(varOut);
        });
        it('returns empty string with empty input', () => {
            // DEFINE VARS
            let varIn = "";
            let varOut = "";

            //assert
            expect(MiscUtil.getHexFromColorString(varIn)).to.equal(varOut);
        });
        it('returns empty string with null input', () => {
            // DEFINE VARS
            let varIn = null;
            let varOut = "";

            //assert
            expect(MiscUtil.getHexFromColorString(varIn)).to.equal(varOut);
        });
        it('returns empty string with bad input rgb characters', () => {
            // DEFINE VARS
            let varIn = "rgb(a,2,3)";
            let varOut = "";

            //assert
            expect(MiscUtil.getHexFromColorString(varIn)).to.equal(varOut);
        });
        it('returns empty string with input of two numbers', () => {
            // DEFINE VARS
            let varIn = "1,2";
            let varOut = "";

            //assert
            expect(MiscUtil.getHexFromColorString(varIn)).to.equal(varOut);
        });
        it('returns empty string with input of one character', () => {
            // DEFINE VARS
            let varIn = "a";
            let varOut = "";

            //assert
            expect(MiscUtil.getHexFromColorString(varIn)).to.equal(varOut);
        });
        it('returns empty string with input of bad hex string', () => {
            // DEFINE VARS
            let varIn = "#10012";
            let varOut = "";

            //assert
            expect(MiscUtil.getHexFromColorString(varIn)).to.equal(varOut);
        });
        it('returns empty string with input of out of range rgb string', () => {
            // DEFINE VARS
            let varIn = "rgb(0,-1,400)";
            let varOut = "";

            //assert
            expect(MiscUtil.getHexFromColorString(varIn)).to.equal(varOut);
        });
    });
    describe('objectToUrlParams', () => {
        it('returns a string representing the key/value pairs in an object - strings', () => {
            // DEFINE VARS
            let varIn = Immutable.Map({
                service: 'A',
                version: 'BB',
                request: 'CCC'
            });
            let varOut = "service=A&version=BB&request=CCC";

            //assert
            expect(MiscUtil.objectToUrlParams(varIn)).to.deep.equal(varOut);
        });
        it('returns a string representing the key/value string pairs in an object - arrays', () => {
            // DEFINE VARS
            let varIn = Immutable.Map({
                service: [12,3],
                version: ["A","B"],
                request: []
            });
            let varOut = "service=12,3&version=A,B&request=";

            //assert
            expect(MiscUtil.objectToUrlParams(varIn)).to.deep.equal(varOut);
        });
        it('returns a string representing the key/value string pairs in an object - empty', () => {
            // DEFINE VARS
            let varIn = Immutable.Map({});
            let varOut = "";

            //assert
            expect(MiscUtil.objectToUrlParams(varIn)).to.deep.equal(varOut);
        });
    })
    describe('parseUrlHashString', () => {
        it('returns an array of objects representing the key/value pairs in a url format hash string', () => {
            // DEFINE VARS
            let varIn = "#a=b&c=d&e=f";
            let varOut = [{
                key: "a",
                value: "b"
            }, {
                key: "c",
                value: "d"
            }, {
                key: "e",
                value: "f"
            }];

            //assert
            expect(MiscUtil.parseUrlHashString(varIn)).to.deep.equal(varOut);
        });
        it('returns an array of objects representing the key/value pairs in a url format string without the preceeding hash', () => {
            // DEFINE VARS
            let varIn = "a=b&c=d,f,g&e=f";
            let varOut = [{
                key: "a",
                value: "b"
            }, {
                key: "c",
                value: "d,f,g"
            }, {
                key: "e",
                value: "f"
            }];

            //assert
            expect(MiscUtil.parseUrlHashString(varIn)).to.deep.equal(varOut);
        });
        it('ignores keys without values and values without keys', () => {
            // DEFINE VARS
            let varIn = "a=b&=c&e=&d";
            let varOut = [{
                key: "a",
                value: "b"
            }];

            //assert
            expect(MiscUtil.parseUrlHashString(varIn)).to.deep.equal(varOut);
        });
    });
});
