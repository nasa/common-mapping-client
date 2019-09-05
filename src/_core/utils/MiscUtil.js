/**
 * Copyright 2017 California Institute of Technology.
 *
 * This source code is licensed under the APACHE 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import fetch from "isomorphic-fetch";
import objectAssign from "object-assign";
import * as appStrings from "_core/constants/appStrings";

export default class MiscUtil {
    /**
     * create a single, space separated string from an object containing
     * a set of string-bool mappings. Each key with a true
     * value is added to the string
     *
     * Example: generateStringFromSet({a: false, b: true, c: true}) --> "b c"
     *
     * @static
     * @param {object} classSet {string: bool, string: bool, ...}
     * @returns {string} space separated string of all keys with a true value
     * @memberof MiscUtil
     */
    static generateStringFromSet(classSet) {
        if (typeof classSet === "object") {
            return Object.keys(classSet)
                .reduce((acc, key) => {
                    if (classSet[key] === true) {
                        acc.push(key);
                        return acc;
                    }
                    return acc;
                }, [])
                .join(" ");
        } else {
            return "";
        }
    }

    /**
     * Find an object within an array of similar objects given an access key
     *
     * @static
     * @param {array} array set of objects to search
     * @param {any} key key by which to access/compare the objects
     * @param {any} val matching value to search for
     * @returns {any} object matching the key-val or false if none was found
     * @memberof MiscUtil
     */
    static findObjectInArray(array, key, val) {
        if (typeof key === "string") {
            for (let i = 0; i < array.length; ++i) {
                if (
                    array[i][key] === val ||
                    (typeof array[i].get === "function" && array[i].get(key) === val)
                ) {
                    return array[i];
                }
            }
        } else if (typeof key === "function") {
            for (let i = 0; i < array.length; ++i) {
                if (key(array[i])) {
                    return array[i];
                }
            }
        }
        return false;
    }

    /**
     * find all objects that match the provided key-val from within the
     * provided set
     *
     * @static
     * @param {array} array set of objects to search
     * @param {any} key key by which to access/compare the objects
     * @param {any} val matching value to search for
     * @returns {array} of all objects matching the key-val or false if none were found
     * @memberof MiscUtil
     */
    static findAllMatchingObjectsInArray(array, key, val) {
        return array.filter(element => {
            return (
                element[key] === val ||
                (typeof element.get === "function" && element.get(key) === val)
            );
        });
    }

    /**
     * Find an object within an array of similar objects given an access key
     *
     * @static
     * @param {array} array set of objects to search
     * @param {any} key key by which to access/compare the objects
     * @param {any} val matching value to search for
     * @returns {object|bool} object of match or false if none was found
     *  - value - {any} object matching the key-value
     *  - index - {number} index in the set of the match
     * @memberof MiscUtil
     */
    static findObjectWithIndexInArray(array, key, val) {
        for (let i = 0; i < array.length; ++i) {
            if (
                array[i][key] === val ||
                (typeof array[i].get === "function" && array[i].get(key) === val)
            ) {
                return {
                    value: array[i],
                    index: i
                };
            }
        }
        return false;
    }

    /**
     * get a function for comparing Immutable objects in a sort
     * function
     *
     * @static
     * @param {any} field field to access within the objects
     * @returns {function} function for comparing objects in a sort
     * @memberof MiscUtil
     */
    static getImmutableObjectSort(field) {
        return (objA, objB) => {
            let fieldA = objA.get(field);
            let fieldB = objB.get(field);

            if (fieldA > fieldB) {
                return 1;
            }
            if (fieldA < fieldB) {
                return -1;
            }
            return 0;
        };
    }

    /**
     * convert an rgb or hex string into a formatted hex string
     *
     * @static
     * @param {string} colorStr rgb or hex color string
     * @returns {string} formatted "#xxxxxx" colorstring
     * @memberof MiscUtil
     */
    static getHexFromColorString(colorStr) {
        let rgbExp = /[0-9]{1,3}(,|, | )[0-9]{1,3}(,|, | )[0-9]{1,3}/;
        let hexExp = /[0-9A-Fa-f]{6}/;

        if (rgbExp.test(colorStr)) {
            return this.convertRgbToHex(colorStr);
        } else if (hexExp.test(colorStr)) {
            return this.formatHex(colorStr);
        }
        return "";
    }

    /**
     * convert rgb color string to hex colorstring
     *
     * @static
     * @param {string} colorStr rgb color string
     * @returns {string} formatted "#xxxxxx" colorstring
     * @memberof MiscUtil
     */
    static convertRgbToHex(colorStr) {
        let rgbExp = /[0-9]{1,3}/g;
        let rgbParts = colorStr.match(rgbExp);

        if (rgbParts && rgbParts.length === 3) {
            // Parse string array to int array
            let rgbPartsInt = rgbParts.map(x => parseInt(x, 10));

            // Validate rgb components are [0-255]
            if (rgbPartsInt.some(x => x < 0 || x > 255)) {
                return "";
            }
            let hexStr =
                ("0" + rgbPartsInt[0].toString(16)).slice(-2) +
                ("0" + rgbPartsInt[1].toString(16)).slice(-2) +
                ("0" + rgbPartsInt[2].toString(16)).slice(-2);
            return this.formatHex(hexStr);
        }
        return "";
    }

    /**
     * format a hex color string
     *
     * @static
     * @param {string} colorStr hex color string
     * @returns {string} formatted "#xxxxxx" colorstring
     * @memberof MiscUtil
     */
    static formatHex(colorStr) {
        let hexExp = /[0-9A-Fa-f]{6}/;
        let hexParts = colorStr.match(hexExp);

        if (hexParts) {
            return "#" + hexParts[0].toUpperCase();
        }
        return "";
    }

    /**
     * force the application window into fullscreen
     *
     * @static
     * @memberof MiscUtil
     */
    static enterFullScreen() {
        let element = document.documentElement;
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }

    /**
     * force the application window out of fullscreen
     *
     * @static
     * @memberof MiscUtil
     */
    static exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }

    /**
     * check if the application is currently in fullscreen
     *
     * @static
     * @returns {boolean} true of the application is fullscreen
     * @memberof MiscUtil
     */
    static getIsInFullScreenMode() {
        return (
            document.fullscreenElement ||
            document.mozFullScreenElement ||
            document.webkitFullscreenElement
        );
    }

    /**
     * convert an ImmutableJS map of key-value pairs to
     * a string of "key=val&key2=val2"
     *
     * @static
     * @param {ImmutableJS.Map} params map of key-value pairs
     * @returns {string} URL arg style string "key=val&key2=val2"
     * @memberof MiscUtil
     */
    static objectToUrlParams(params) {
        let arr = params.reduce((acc, el, i) => {
            acc.push(i + "=" + el);
            return acc;
        }, []);
        return arr.join("&");
    }

    /**
     * parse url query string into a set of key-value pairs
     *
     * @static
     * @param {string} urlStr URL query string
     * @returns {array} list of {key: val} pairs
     * @memberof MiscUtil
     */
    static parseUrlQueryString(urlStr) {
        // return urlStr.replace(/^\?\/?|\/$/g, '').split('&').reduce((acc, param) => {
        return urlStr
            .replace(/^#\/?|\/$/g, "")
            .split("&")
            .reduce((acc, param) => {
                let paramParts = param.split("=");
                if (
                    paramParts &&
                    paramParts.length >= 2 &&
                    paramParts[0] !== "" &&
                    paramParts[1] !== ""
                ) {
                    acc.push({
                        key: paramParts[0],
                        value: paramParts.slice(1).join("=")
                    });
                }
                return acc;
            }, []);
    }

    /**
     * extract application query string from the url.
     * Taken from the hash string
     *
     * @static
     * @returns {string} url query string
     * @memberof MiscUtil
     */
    static getUrlParams() {
        // return this.parseUrlQueryString(window.location.search);
        return this.parseUrlQueryString(window.location.hash);
    }

    /**
     * check if a url is cross-origin or not
     *
     * @static
     * @param {string} url url string to check
     * @returns {boolean} true if the url is cross-origin
     * @memberof MiscUtil
     */
    static urlIsCrossorigin(url) {
        let a = document.createElement("a");

        // copy window location into the anchor to get consistent results
        // when the port is default for the protocol (e.g. 80 for HTTP)
        a.href = window.location.href;

        // host includes both hostname and port if the port is not standard
        let host = a.host;
        let protocol = a.protocol;

        a.href = url;
        /* eslint-disable no-self-assign */
        a.href = a.href; // IE only absolutizes href on get, not set
        /* eslint-enable no-self-assign */

        return protocol !== a.protocol || host !== a.host;
    }

    /**
     * open a url in a new tab
     *
     * @static
     * @param {string} url url to open
     * @memberof MiscUtil
     */
    static openLinkInNewTab(url) {
        window.open(url, "_blank");
    }

    /**
     * open a new mailto link
     *
     * @static
     * @param {string} address email address to open the mailto to
     * @memberof MiscUtil
     */
    static mailTo(address) {
        window.location.href = "mailto:" + address;
    }

    /**
     * pad the front of a number string to a specified length
     *
     * @static
     * @param {number|string} num number to pad
     * @param {number} length desired length of the number string
     * @param {string} [pad="0"] the string to padd with
     * @returns {string} string number front padded to the specified length
     * @memberof MiscUtil
     */
    static padNumber(num, length, pad = "0") {
        // convert the number to a string
        num = num + "";

        // check for floating point
        if (num.indexOf(".") !== -1) {
            length += 1;
        }

        // get amount of padding needed
        let padSize = length - num.length;
        if (padSize > 0) {
            // create the padding string
            let padStr = "";
            for (let i = 0; i < padSize; ++i) {
                padStr += pad;
            }

            // pad the string
            num = padStr + num;
        }

        return num;
    }

    /**
     * fetch a remote resource using an async request
     *
     * @static
     * @param {object} options set of request options
     * - url - {string} the url of the resource
     * - handleAs - {string} resource type (json|markdown|xml)
     * - options - {object} fetch specific options https://github.com/matthew-andrews/isomorphic-fetch
     * @returns {Promise} a promise that is resolved when the resource has loaded and been through the initial processing
     * @memberof MiscUtil
     */
    static asyncFetch(options) {
        let url = options.url;
        let handleAs = options.handleAs;
        let fetchOptions = options.options;

        return new Promise((resolve, reject) => {
            fetch(url, fetchOptions)
                .then(response => {
                    if (response.status >= 400) {
                        reject(new Error("Bad response from server"));
                    } else {
                        switch (handleAs) {
                            case appStrings.FILE_TYPE_JSON:
                                return response.json();
                            case appStrings.FILE_TYPE_XML:
                                return response.text();
                            case appStrings.FILE_TYPE_MARKDOWN:
                                return response.text();
                            case appStrings.LAYER_CONFIG_JSON:
                                return response.json();
                            case appStrings.LAYER_CONFIG_WMTS_XML:
                                return response.text();
                            case appStrings.LAYER_CONFIG_WMS_XML:
                                return response.text();
                            case appStrings.FILE_TYPE_TEXT:
                                return response.text();
                            default:
                                return response;
                        }
                    }
                })
                .then(parsedResponse => {
                    resolve(parsedResponse);
                })
                .catch(err => {
                    console.warn("Error in asyncFetch: ", err);
                    reject(err);
                });
        });
    }
}
