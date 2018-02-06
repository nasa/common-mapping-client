/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { expect } from "chai";
import Immutable from "immutable";
import MiscUtil from "_core/utils/MiscUtil";

export const MiscUtilSpec = {
    name: "MiscUtilSpec",
    tests: {
        generateStringFromSet: {
            test1: () => {
                it("returns a space separated string from a set of strings mapped to booleans", () => {
                    let varIn = {
                        foo: true,
                        bar: false,
                        fubar: true
                    };
                    let varOut = "foo fubar";

                    //assert
                    expect(MiscUtil.generateStringFromSet(varIn)).to.equal(varOut);
                });
            },
            test2: () => {
                it("handles only string booleans (true/false)", () => {
                    let varIn = {
                        foo: 1,
                        bar: true,
                        fubar: "true"
                    };
                    let varOut = "bar";

                    //assert
                    expect(MiscUtil.generateStringFromSet(varIn)).to.equal(varOut);
                });
            },
            test3: () => {
                it("returns empty string if no strings map to true", () => {
                    let varIn = {
                        foo: false,
                        bar: false,
                        fubar: false
                    };
                    let varOut = "";

                    //assert
                    expect(MiscUtil.generateStringFromSet(varIn)).to.equal(varOut);
                });
            },
            test4: () => {
                it("returns empty string if input is not an object", () => {
                    let varIn = "fluffy";
                    let varOut = "";

                    //assert
                    expect(MiscUtil.generateStringFromSet(varIn)).to.equal(varOut);
                });
            }
        },
        findObjectInArray: {
            test1: () => {
                it("returns the first object in an array that has a matching key/value pair", () => {
                    // DEFINE VARS
                    let varIn = [
                        {
                            testkey: "testvalue",
                            indexA: true
                        },
                        {
                            testkey: "testvalue",
                            indexB: true
                        },
                        {
                            testkey: "testvalue",
                            indexC: true
                        }
                    ];
                    let varOut = varIn[0];

                    //assert
                    expect(MiscUtil.findObjectInArray(varIn, "testkey", "testvalue")).to.equal(
                        varOut
                    );
                });
            },
            test2: () => {
                it("returns false if a matching object is not found", () => {
                    // DEFINE VARS
                    let varIn = [
                        {
                            testkey: "testvalue",
                            indexA: true
                        },
                        {
                            testkey: "testvalue",
                            indexB: true
                        },
                        {
                            testkey: "testvalue",
                            indexC: true
                        }
                    ];
                    let varOut = false;

                    //assert
                    expect(MiscUtil.findObjectInArray(varIn, "indexD", true)).to.equal(varOut);
                });
            },
            test3: () => {
                it("accepts a function instead of a key/val pair", () => {
                    // DEFINE VARS
                    let varIn = [
                        {
                            testkey: "testvalue",
                            indexA: true
                        },
                        {
                            testkey: "testvalue",
                            indexB: true
                        },
                        {
                            testkey: "testvalue",
                            indexC: true
                        }
                    ];
                    let varOut = varIn[1];

                    let compFunc = el => {
                        return el.indexB === true;
                    };

                    //assert
                    expect(MiscUtil.findObjectInArray(varIn, compFunc)).to.equal(varOut);
                });
            },
            test4: () => {
                it("accepts a function instead of a key/val pair and returns false if no match is found", () => {
                    // DEFINE VARS
                    let varIn = [
                        {
                            testkey: "testvalue",
                            indexA: true
                        },
                        {
                            testkey: "testvalue",
                            indexB: true
                        },
                        {
                            testkey: "testvalue",
                            indexC: true
                        }
                    ];
                    let varOut = false;

                    let compFunc = el => {
                        return el.indexD === true;
                    };

                    //assert
                    expect(MiscUtil.findObjectInArray(varIn, compFunc)).to.equal(varOut);
                });
            }
        },
        findAllMatchingObjectsInArray: {
            test1: () => {
                it("returns all the objects in an array that have a matching key/value pair", () => {
                    // DEFINE VARS
                    let varIn = [
                        {
                            testkey: "testvalueA",
                            indexA: true
                        },
                        {
                            testkey: "testvalueA",
                            indexB: true
                        },
                        {
                            testkey: "testvalueA",
                            indexC: true
                        },
                        {
                            testkey: "testvalueB",
                            indexD: true
                        },
                        {
                            testkey: "testvalueB",
                            indexE: true
                        },
                        {
                            testkey: "testvalueB",
                            indexF: true
                        }
                    ];
                    let varOut = [
                        {
                            testkey: "testvalueA",
                            indexA: true
                        },
                        {
                            testkey: "testvalueA",
                            indexB: true
                        },
                        {
                            testkey: "testvalueA",
                            indexC: true
                        }
                    ];

                    //assert
                    expect(
                        MiscUtil.findAllMatchingObjectsInArray(varIn, "testkey", "testvalueA")
                    ).to.deep.equal(varOut);
                });
            },
            test2: () => {
                it("returns an empty array if matching objects are not found", () => {
                    // DEFINE VARS
                    let varIn = [
                        {
                            testkey: "testvalue",
                            indexA: true
                        },
                        {
                            testkey: "testvalue",
                            indexB: true
                        },
                        {
                            testkey: "testvalue",
                            indexC: true
                        }
                    ];
                    let varOut = [];

                    //assert
                    expect(
                        MiscUtil.findAllMatchingObjectsInArray(varIn, "testkey", "testvalueA")
                    ).to.deep.equal(varOut);
                });
            }
        },
        findObjectWithIndexInArray: {
            test1: () => {
                it("returns an object containing the first object in an array that has a matching key/value pair and its index in the array", () => {
                    // DEFINE VARS
                    let varIn = [
                        {
                            testkey: "testvalue",
                            indexA: true
                        },
                        {
                            testkey: "testvalue",
                            indexB: true
                        },
                        {
                            testkey: "testvalue",
                            indexC: true
                        }
                    ];
                    let varOut = {
                        value: varIn[1],
                        index: 1
                    };

                    //assert
                    expect(
                        MiscUtil.findObjectWithIndexInArray(varIn, "indexB", true)
                    ).to.deep.equal(varOut);
                });
            },
            test2: () => {
                it("returns false if a matching object is not found", () => {
                    // DEFINE VARS
                    let varIn = [
                        {
                            testkey: "testvalue",
                            indexA: true
                        },
                        {
                            testkey: "testvalue",
                            indexB: true
                        },
                        {
                            testkey: "testvalue",
                            indexC: true
                        }
                    ];
                    let varOut = false;

                    //assert
                    expect(MiscUtil.findObjectWithIndexInArray(varIn, "indexD", true)).to.equal(
                        varOut
                    );
                });
            }
        },
        getImmutableObjectSort: {
            test1: () => {
                it("takes a key and returns a sort function comparing that key for an Immutable List of Map objects.", () => {
                    // DEFINE VARS
                    let immutableArr = Immutable.fromJS([
                        {
                            index: 4,
                            testkey: "testvalue"
                        },
                        {
                            index: 2,
                            testkey: "testvalue"
                        },
                        {
                            index: 1,
                            testkey: "testvalue"
                        },
                        {
                            index: 5,
                            testkey: "testvalue"
                        },
                        {
                            index: 3,
                            testkey: "testvalue"
                        }
                    ]);
                    let varIn = MiscUtil.getImmutableObjectSort("index");
                    let varOut = [
                        {
                            index: 1,
                            testkey: "testvalue"
                        },
                        {
                            index: 2,
                            testkey: "testvalue"
                        },
                        {
                            index: 3,
                            testkey: "testvalue"
                        },
                        {
                            index: 4,
                            testkey: "testvalue"
                        },
                        {
                            index: 5,
                            testkey: "testvalue"
                        }
                    ];

                    //assert
                    expect(immutableArr.sort(varIn).toJS()).to.deep.equal(varOut);
                });
            },
            test2: () => {
                it("takes a key and returns a sort function comparing that key for an Immutable List of Map objects with shared indices.", () => {
                    // DEFINE VARS
                    let immutableArr = Immutable.fromJS([
                        {
                            index: 4,
                            testkey: "testvalue"
                        },
                        {
                            index: 4,
                            testkey: "testvalue"
                        },
                        {
                            index: 1,
                            testkey: "testvalue"
                        },
                        {
                            index: 5,
                            testkey: "testvalue"
                        },
                        {
                            index: 3,
                            testkey: "testvalue"
                        }
                    ]);
                    let varIn = MiscUtil.getImmutableObjectSort("index");
                    let varOut = [
                        {
                            index: 1,
                            testkey: "testvalue"
                        },
                        {
                            index: 3,
                            testkey: "testvalue"
                        },
                        {
                            index: 4,
                            testkey: "testvalue"
                        },
                        {
                            index: 4,
                            testkey: "testvalue"
                        },
                        {
                            index: 5,
                            testkey: "testvalue"
                        }
                    ];

                    //assert
                    expect(immutableArr.sort(varIn).toJS()).to.deep.equal(varOut);
                });
            }
        },
        getHexFromColorString: {
            test1: () => {
                it("returns a hex string from an rgb string with space separators", () => {
                    // DEFINE VARS
                    let varIn = "123 32 3";
                    let varOut = "#7B2003";

                    //assert
                    expect(MiscUtil.getHexFromColorString(varIn)).to.equal(varOut);
                });
            },

            test2: () => {
                it("returns a hex string from an rgb string with comma separators", () => {
                    // DEFINE VARS
                    let varIn = "123,32,3";
                    let varOut = "#7B2003";

                    //assert
                    expect(MiscUtil.getHexFromColorString(varIn)).to.equal(varOut);
                });
            },
            test3: () => {
                it("returns a hex string from an rgb string with comma space separators", () => {
                    // DEFINE VARS
                    let varIn = "123, 32, 3";
                    let varOut = "#7B2003";

                    //assert
                    expect(MiscUtil.getHexFromColorString(varIn)).to.equal(varOut);
                });
            },
            test4: () => {
                it("returns a hex string from an rgb string with an rgb wrapper", () => {
                    // DEFINE VARS
                    let varIn = "rgb(123,32,3)";
                    let varOut = "#7B2003";

                    //assert
                    expect(MiscUtil.getHexFromColorString(varIn)).to.equal(varOut);
                });
            },
            test5: () => {
                it("returns a capitalized hex string from a hex string", () => {
                    // DEFINE VARS
                    let varIn = "#7b2003";
                    let varOut = "#7B2003";

                    //assert
                    expect(MiscUtil.getHexFromColorString(varIn)).to.equal(varOut);
                });
            },
            test6: () => {
                it("returns a # prefixed hex string from a hex number", () => {
                    // DEFINE VARS
                    let varIn = "7b2003";
                    let varOut = "#7B2003";

                    //assert
                    expect(MiscUtil.getHexFromColorString(varIn)).to.equal(varOut);
                });
            },
            test7: () => {
                it("returns empty string with empty input", () => {
                    // DEFINE VARS
                    let varIn = "";
                    let varOut = "";

                    //assert
                    expect(MiscUtil.getHexFromColorString(varIn)).to.equal(varOut);
                });
            },
            test8: () => {
                it("returns empty string with null input", () => {
                    // DEFINE VARS
                    let varIn = null;
                    let varOut = "";

                    //assert
                    expect(MiscUtil.getHexFromColorString(varIn)).to.equal(varOut);
                });
            },
            test9: () => {
                it("returns empty string with bad input rgb characters", () => {
                    // DEFINE VARS
                    let varIn = "rgb(a,2,3)";
                    let varOut = "";

                    //assert
                    expect(MiscUtil.getHexFromColorString(varIn)).to.equal(varOut);
                });
            },
            test10: () => {
                it("returns empty string with input of two numbers", () => {
                    // DEFINE VARS
                    let varIn = "1,2";
                    let varOut = "";

                    //assert
                    expect(MiscUtil.getHexFromColorString(varIn)).to.equal(varOut);
                });
            },
            test11: () => {
                it("returns empty string with input of one character", () => {
                    // DEFINE VARS
                    let varIn = "a";
                    let varOut = "";

                    //assert
                    expect(MiscUtil.getHexFromColorString(varIn)).to.equal(varOut);
                });
            },
            test12: () => {
                it("returns empty string with input of bad hex string", () => {
                    // DEFINE VARS
                    let varIn = "#10012";
                    let varOut = "";

                    //assert
                    expect(MiscUtil.getHexFromColorString(varIn)).to.equal(varOut);
                });
            },
            test13: () => {
                it("returns empty string with input of out of range rgb string", () => {
                    // DEFINE VARS
                    let varIn = "rgb(0,-1,400)";
                    let varOut = "";

                    //assert
                    expect(MiscUtil.getHexFromColorString(varIn)).to.equal(varOut);
                });
            }
        },
        convertRgbToHex: {
            test1: () => {
                it("converts rgb to hex", () => {
                    // DEFINE VARS
                    let varIn = "rgb(1,2,3)";
                    let varOut = "#010203";

                    //assert
                    expect(MiscUtil.convertRgbToHex(varIn)).to.equal(varOut);
                });
            },
            test2: () => {
                it("returns empty string when one of the rgb values is > 255", () => {
                    // DEFINE VARS
                    let varIn = "rgb(511,2,3)";
                    let varOut = "";

                    //assert
                    expect(MiscUtil.convertRgbToHex(varIn)).to.equal(varOut);
                });
            },
            test3: () => {
                it("returns empty string when given invalid input", () => {
                    // DEFINE VARS
                    let varIn = "zrgbs(zz,2,3)";
                    let varOut = "";

                    //assert
                    expect(MiscUtil.convertRgbToHex(varIn)).to.equal(varOut);
                });
            },
            test4: () => {
                it("returns empty string when given input of incorrect length", () => {
                    // DEFINE VARS
                    let varIn = "rgba(1,2,3,0.5)";
                    let varOut = "";

                    //assert
                    expect(MiscUtil.convertRgbToHex(varIn)).to.equal(varOut);
                });
            }
        },
        formatHex: {
            test1: () => {
                it("returns empty string if given unmatching input", () => {
                    // DEFINE VARS
                    let varIn = "rgb(1,2,3)";
                    let varOut = "";

                    //assert
                    expect(MiscUtil.formatHex(varIn)).to.equal(varOut);
                });
            }
        },
        objectToUrlParams: {
            test1: () => {
                it("returns a string representing the key/value pairs in an object - strings", () => {
                    // DEFINE VARS
                    let varIn = Immutable.Map({
                        service: "A",
                        version: "BB",
                        request: "CCC"
                    });
                    let varOut = "service=A&version=BB&request=CCC";

                    //assert
                    expect(MiscUtil.objectToUrlParams(varIn)).to.deep.equal(varOut);
                });
            },
            test2: () => {
                it("returns a string representing the key/value string pairs in an object - arrays", () => {
                    // DEFINE VARS
                    let varIn = Immutable.Map({
                        service: [12, 3],
                        version: ["A", "B"],
                        request: []
                    });
                    let varOut = "service=12,3&version=A,B&request=";

                    //assert
                    expect(MiscUtil.objectToUrlParams(varIn)).to.deep.equal(varOut);
                });
            },
            test3: () => {
                it("returns a string representing the key/value string pairs in an object - empty", () => {
                    // DEFINE VARS
                    let varIn = Immutable.Map({});
                    let varOut = "";

                    //assert
                    expect(MiscUtil.objectToUrlParams(varIn)).to.deep.equal(varOut);
                });
            }
        },
        parseUrlQueryString: {
            test1: () => {
                it("returns an array of objects representing the key/value pairs in a url format hash string", () => {
                    // DEFINE VARS
                    let varIn = "#a=b&c=d&e=f";
                    let varOut = [
                        {
                            key: "a",
                            value: "b"
                        },
                        {
                            key: "c",
                            value: "d"
                        },
                        {
                            key: "e",
                            value: "f"
                        }
                    ];

                    //assert
                    expect(MiscUtil.parseUrlQueryString(varIn)).to.deep.equal(varOut);
                });
            },
            test2: () => {
                it("returns an array of objects representing the key/value pairs in a url format string without the preceeding hash", () => {
                    // DEFINE VARS
                    let varIn = "a=b&c=d,f,g&e=f";
                    let varOut = [
                        {
                            key: "a",
                            value: "b"
                        },
                        {
                            key: "c",
                            value: "d,f,g"
                        },
                        {
                            key: "e",
                            value: "f"
                        }
                    ];

                    //assert
                    expect(MiscUtil.parseUrlQueryString(varIn)).to.deep.equal(varOut);
                });
            },
            test3: () => {
                it("ignores keys without values and values without keys", () => {
                    // DEFINE VARS
                    let varIn = "a=b&=c&e=&d";
                    let varOut = [
                        {
                            key: "a",
                            value: "b"
                        }
                    ];

                    //assert
                    expect(MiscUtil.parseUrlQueryString(varIn)).to.deep.equal(varOut);
                });
            },
            test4: () => {
                it("presrves key-value pairs within parameters", () => {
                    // DEFINE VARS
                    let varIn = "a=b&c=d,e=f,g=h";
                    let varOut = [
                        {
                            key: "a",
                            value: "b"
                        },
                        {
                            key: "c",
                            value: "d,e=f,g=h"
                        }
                    ];

                    //assert
                    expect(MiscUtil.parseUrlQueryString(varIn)).to.deep.equal(varOut);
                });
            }
        },
        getIsInFullScreenMode: {
            test1: () => {
                it("returns null when not in fullscreen", () => {
                    // Testing fullscreen is more trouble than it's worth here since
                    // fullscreen is difficult to initiate without direct user input
                    expect(MiscUtil.getIsInFullScreenMode()).to.be.null;
                });
            }
        },
        getUrlParams: {
            test1: () => {
                it("returns an empty array for no history", () => {
                    expect(MiscUtil.getUrlParams()).to.deep.equal([]);
                });
            },
            test2: () => {
                it("returns an array of key value objects for a valid query string url", () => {
                    let varIn = "#a=b&c=d&f=1.23";
                    let varOut = [
                        {
                            key: "a",
                            value: "b"
                        },
                        {
                            key: "c",
                            value: "d"
                        },
                        {
                            key: "f",
                            value: "1.23"
                        }
                    ];
                    window.history.replaceState(undefined, undefined, varIn);
                    expect(MiscUtil.getUrlParams()).to.deep.equal(varOut);
                });
            }
        },
        padNumber: {
            test1: () => {
                it("pads a number or string up the specified length", () => {
                    let varIn = [1, "12", 112, "1212"];
                    let varOut = ["0001", "0012", "0112", "1212"];
                    let padLen = 4;

                    for (let i = 0; i < varIn.length; ++i) {
                        expect(MiscUtil.padNumber(varIn[i], padLen)).to.equal(varOut[i]);
                    }
                });
            },
            test2: () => {
                it("pads float strings ignoring the .", () => {
                    let varIn = ["1.0", "12.1", "112.0", "1212.0"];
                    let varOut = ["001.0", "012.1", "112.0", "1212.0"];
                    let padLen = 4;

                    for (let i = 0; i < varIn.length; ++i) {
                        expect(MiscUtil.padNumber(varIn[i], padLen)).to.equal(varOut[i]);
                    }
                });
            }
        }
    }
};
