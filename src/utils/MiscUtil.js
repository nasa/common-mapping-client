import objectAssign from 'object-assign';

export default class MiscUtil {
    // takes in an object mapping strings (as keys) to booleans
    // and returns a space separated string of those keys that map to true
    static generateStringFromSet(classSet) {
        if (typeof classSet === "object") {
            return Object.keys(classSet).reduce((acc, key) => {
                if (classSet[key] === true) {
                    acc.push(key);
                    return acc;
                }
                return acc;
            }, []).join(' ');
        } else {
            return "";
        }
    }

    static findObjectInArray(array, key, val) {
        for (let i = 0; i < array.length; ++i) {
            if (array[i][key] === val) {
                return array[i];
            }
        }
        return false;
    }

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

    static exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }

}
