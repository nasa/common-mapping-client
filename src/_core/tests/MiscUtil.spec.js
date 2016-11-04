import { expect } from 'chai';
import Immutable from 'immutable';
import MiscUtil from '_core/utils/MiscUtil';

const miscUtil = new MiscUtil();

export const MiscUtilSpec = {
    name: "MiscUtilSpec",
    tests: {
        generateStringFromSet: {
            test1: () => {
                it('returns a space separated string from a set of strings mapped to booleans', () => {
                    let varIn = {
                        "foo": true,
                        "bar": false,
                        "fubar": true
                    };
                    let varOut = 'foo fubar';

                    //assert
                    expect(miscUtil.generateStringFromSet(varIn)).to.equal(varOut);
                });
            },
            test2: () => {
                it('handles only string booleans (true/false)', () => {
                    let varIn = {
                        "foo": 1,
                        "bar": true,
                        "fubar": "true"
                    };
                    let varOut = 'bar';

                    //assert
                    expect(miscUtil.generateStringFromSet(varIn)).to.equal(varOut);
                });
            },
            test3: () => {
                it('returns empty string if no strings map to true', () => {
                    let varIn = {
                        "foo": false,
                        "bar": false,
                        "fubar": false
                    };
                    let varOut = '';

                    //assert
                    expect(miscUtil.generateStringFromSet(varIn)).to.equal(varOut);
                });
            }
        },
        findObjectInArray: {
            test1: () => {
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
                    expect(miscUtil.findObjectInArray(varIn, "testkey", "testvalue")).to.equal(varOut);
                });
            },
            test2: () => {
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
                    expect(miscUtil.findObjectInArray(varIn, "indexD", true)).to.equal(varOut);
                });
            },
            test3: () => {
                it('accepts a function instead of a key/val pair', () => {
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
                    let varOut = varIn[1];

                    let compFunc = (el) => {
                        return el.indexB === true;
                    };

                    //assert
                    expect(miscUtil.findObjectInArray(varIn, compFunc)).to.equal(varOut);
                });
            },
            test4: () => {
                it('accepts a function instead of a key/val pair and returns false if no match is found', () => {
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

                    let compFunc = (el) => {
                        return el.indexD === true;
                    };

                    //assert
                    expect(miscUtil.findObjectInArray(varIn, compFunc)).to.equal(varOut);
                });
            }
        },
        findAllMatchingObjectsInArray: {
            test1: () => {
                it('returns all the objects in an array that have a matching key/value pair', () => {
                    // DEFINE VARS
                    let varIn = [{
                        testkey: "testvalueA",
                        indexA: true
                    }, {
                        testkey: "testvalueA",
                        indexB: true
                    }, {
                        testkey: "testvalueA",
                        indexC: true
                    }, {
                        testkey: "testvalueB",
                        indexD: true
                    }, {
                        testkey: "testvalueB",
                        indexE: true
                    }, {
                        testkey: "testvalueB",
                        indexF: true
                    }];
                    let varOut = [{
                        testkey: "testvalueA",
                        indexA: true
                    }, {
                        testkey: "testvalueA",
                        indexB: true
                    }, {
                        testkey: "testvalueA",
                        indexC: true
                    }];

                    //assert
                    expect(miscUtil.findAllMatchingObjectsInArray(varIn, "testkey", "testvalueA")).to.deep.equal(varOut);
                });
            },
            test2: () => {
                it('returns an empty array if matching objects are not found', () => {
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
                    let varOut = [];

                    //assert
                    expect(miscUtil.findAllMatchingObjectsInArray(varIn, "testkey", "testvalueA")).to.deep.equal(varOut);
                });
            }
        },
        findObjectWithIndexInArray: {
            test1: () => {
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
                    expect(miscUtil.findObjectWithIndexInArray(varIn, "indexB", true)).to.deep.equal(varOut);
                });
            },
            test2: () => {
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
                    expect(miscUtil.findObjectWithIndexInArray(varIn, "indexD", true)).to.equal(varOut);
                });
            }
        },
        getImmutableObjectSort: {
            test1: () => {
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
                    let varIn = miscUtil.getImmutableObjectSort("index");
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
            }
        },
        getHexFromColorString: {
            test1: () => {
                it('returns a hex string from an rgb string with space separators', () => {
                    // DEFINE VARS
                    let varIn = "123 32 3";
                    let varOut = "#7B2003";

                    //assert
                    expect(miscUtil.getHexFromColorString(varIn)).to.equal(varOut);
                });
            },

            test2: () => {
                it('returns a hex string from an rgb string with comma separators', () => {
                    // DEFINE VARS
                    let varIn = "123,32,3";
                    let varOut = "#7B2003";

                    //assert
                    expect(miscUtil.getHexFromColorString(varIn)).to.equal(varOut);
                });
            },
            test3: () => {
                it('returns a hex string from an rgb string with comma space separators', () => {
                    // DEFINE VARS
                    let varIn = "123, 32, 3";
                    let varOut = "#7B2003";

                    //assert
                    expect(miscUtil.getHexFromColorString(varIn)).to.equal(varOut);
                });
            },
            test4: () => {
                it('returns a hex string from an rgb string with an rgb wrapper', () => {
                    // DEFINE VARS
                    let varIn = "rgb(123,32,3)";
                    let varOut = "#7B2003";

                    //assert
                    expect(miscUtil.getHexFromColorString(varIn)).to.equal(varOut);
                });
            },
            test5: () => {
                it('returns a capitalized hex string from a hex string', () => {
                    // DEFINE VARS
                    let varIn = "#7b2003";
                    let varOut = "#7B2003";

                    //assert
                    expect(miscUtil.getHexFromColorString(varIn)).to.equal(varOut);
                });
            },
            test6: () => {
                it('returns a # prefixed hex string from a hex number', () => {
                    // DEFINE VARS
                    let varIn = "7b2003";
                    let varOut = "#7B2003";

                    //assert
                    expect(miscUtil.getHexFromColorString(varIn)).to.equal(varOut);
                });
            },
            test7: () => {
                it('returns empty string with empty input', () => {
                    // DEFINE VARS
                    let varIn = "";
                    let varOut = "";

                    //assert
                    expect(miscUtil.getHexFromColorString(varIn)).to.equal(varOut);
                });
            },
            test8: () => {
                it('returns empty string with null input', () => {
                    // DEFINE VARS
                    let varIn = null;
                    let varOut = "";

                    //assert
                    expect(miscUtil.getHexFromColorString(varIn)).to.equal(varOut);
                });
            },
            test9: () => {
                it('returns empty string with bad input rgb characters', () => {
                    // DEFINE VARS
                    let varIn = "rgb(a,2,3)";
                    let varOut = "";

                    //assert
                    expect(miscUtil.getHexFromColorString(varIn)).to.equal(varOut);
                });
            },
            test10: () => {
                it('returns empty string with input of two numbers', () => {
                    // DEFINE VARS
                    let varIn = "1,2";
                    let varOut = "";

                    //assert
                    expect(miscUtil.getHexFromColorString(varIn)).to.equal(varOut);
                });
            },
            test11: () => {
                it('returns empty string with input of one character', () => {
                    // DEFINE VARS
                    let varIn = "a";
                    let varOut = "";

                    //assert
                    expect(miscUtil.getHexFromColorString(varIn)).to.equal(varOut);
                });
            },
            test12: () => {
                it('returns empty string with input of bad hex string', () => {
                    // DEFINE VARS
                    let varIn = "#10012";
                    let varOut = "";

                    //assert
                    expect(miscUtil.getHexFromColorString(varIn)).to.equal(varOut);
                });
            },
            test13: () => {
                it('returns empty string with input of out of range rgb string', () => {
                    // DEFINE VARS
                    let varIn = "rgb(0,-1,400)";
                    let varOut = "";

                    //assert
                    expect(miscUtil.getHexFromColorString(varIn)).to.equal(varOut);
                });
            }

        },
        objectToUrlParams: {
            test1: () => {
                it('returns a string representing the key/value pairs in an object - strings', () => {
                    // DEFINE VARS
                    let varIn = Immutable.Map({
                        service: 'A',
                        version: 'BB',
                        request: 'CCC'
                    });
                    let varOut = "service=A&version=BB&request=CCC";

                    //assert
                    expect(miscUtil.objectToUrlParams(varIn)).to.deep.equal(varOut);
                });
            },
            test2: () => {
                it('returns a string representing the key/value string pairs in an object - arrays', () => {
                    // DEFINE VARS
                    let varIn = Immutable.Map({
                        service: [12, 3],
                        version: ["A", "B"],
                        request: []
                    });
                    let varOut = "service=12,3&version=A,B&request=";

                    //assert
                    expect(miscUtil.objectToUrlParams(varIn)).to.deep.equal(varOut);
                });
            },
            test3: () => {
                it('returns a string representing the key/value string pairs in an object - empty', () => {
                    // DEFINE VARS
                    let varIn = Immutable.Map({});
                    let varOut = "";

                    //assert
                    expect(miscUtil.objectToUrlParams(varIn)).to.deep.equal(varOut);
                });
            }
        },
        parseUrlHashString: {
            test1: () => {
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
                    expect(miscUtil.parseUrlHashString(varIn)).to.deep.equal(varOut);
                });
            },
            test2: () => {
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
                    expect(miscUtil.parseUrlHashString(varIn)).to.deep.equal(varOut);
                });
            },
            test3: () => {
                it('ignores keys without values and values without keys', () => {
                    // DEFINE VARS
                    let varIn = "a=b&=c&e=&d";
                    let varOut = [{
                        key: "a",
                        value: "b"
                    }];

                    //assert
                    expect(miscUtil.parseUrlHashString(varIn)).to.deep.equal(varOut);
                });
            }

        }
    }
};
