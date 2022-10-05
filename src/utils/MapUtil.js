import MapUtilCore from "_core/utils/MapUtil";

export default class MapUtil extends MapUtilCore {
    static getFeatureColorFromPalette(palette, parameterValue) {
        try {
            let color = "#ffffff";
            for (let part of palette.values) {
                const interval = part.value.split("-");
                if (interval.length === 2) {
                    if (interval[0] && interval[1]) {
                        const boundInf = parseFloat(interval[0].trim());
                        const boundSup = parseFloat(interval[1].trim());

                        if (parameterValue > boundInf && parameterValue <= boundSup) {
                            color = part.color;
                            break;
                        }
                    }
                } else if (interval.length === 1) {
                    if (interval[0]) {
                        const textValue = interval[0].trim();
                        if (eval(parameterValue + textValue)) {
                            color = part.color;
                            break;
                        }
                    }
                } else {
                    throw new Error(
                        "palette configurations incorrectly formatted for id = " + palette.id
                    );
                }
            }
            return color;
        } catch (err) {
            console.warn("Error in MapUtil.getFeatureColorFromPalette:", err);
            return false;
        }
    }
}
