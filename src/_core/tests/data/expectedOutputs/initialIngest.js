export const LAYERS = {
    data: {
        facilities_kml: {
            timeFormat: "YYYY-MM-DD",
            max: 0,
            isDisabled: false,
            displayIndex: 0,
            mappingOptions: {
                matrixSet: undefined,
                requestEncoding: "KVP",
                extents: [-180, -90, 180, 90],
                urlFunctions: {},
                tileFunctions: {},
                url: "",
                projection: undefined,
                layer: "",
                tileGrid: { origin: [-180, 90], resolutions: [], matrixIds: [], tileSize: 256 },
                format: "image/png"
            },
            opacity: 1,
            urlFunctions: {},
            url: "default-data/_core_default-data/facilities.kml",
            metadata: { url: null, handleAs: "markdown" },
            units: "",
            thumbnailImage: "https://unsplash.it/700/400?image=1025",
            isActive: false,
            min: 0,
            fromJson: true,
            updateParameters: { time: false },
            isDefault: false,
            title: "Facilities - KML",
            handleAs: "vector_kml",
            type: "data",
            id: "facilities_kml",
            palette: { name: "", url: "", handleAs: "", min: 0, max: 0 },
            clusterVector: false
        },
        us_state_outline_topojson: {
            timeFormat: "YYYY-MM-DD",
            max: 0,
            isDisabled: false,
            displayIndex: 0,
            mappingOptions: {
                matrixSet: undefined,
                requestEncoding: "KVP",
                extents: [-180, -90, 180, 90],
                urlFunctions: {},
                tileFunctions: {},
                url: "",
                projection: undefined,
                layer: "",
                tileGrid: { origin: [-180, 90], resolutions: [], matrixIds: [], tileSize: 256 },
                format: "image/png"
            },
            opacity: 1,
            urlFunctions: {},
            url: "default-data/_core_default-data/ne_10m_us_states.topojson",
            metadata: { url: null, handleAs: "markdown" },
            units: "",
            thumbnailImage: "https://unsplash.it/700/400?image=1025",
            isActive: false,
            min: 0,
            fromJson: true,
            updateParameters: { time: false },
            isDefault: false,
            title: "US State Outline - TopoJSON",
            handleAs: "vector_topojson",
            type: "data",
            id: "us_state_outline_topojson",
            palette: { name: "", url: "", handleAs: "", min: 0, max: 0 },
            clusterVector: false
        },
        GHRSST_L4_G1SST_Sea_Surface_Temperature: {
            timeFormat: "YYYY-MM-DD",
            max: 32,
            isDisabled: false,
            displayIndex: 0,
            mappingOptions: {
                matrixSet: "1km",
                requestEncoding: "REST",
                extents: [-180, -90, 180, 90],
                urlFunctions: { openlayers: "kvpTimeParam", cesium: "kvpTimeParam" },
                tileFunctions: {},
                url:
                    "http://gibs.earthdata.nasa.gov/wmts/epsg4326/best/GHRSST_L4_G1SST_Sea_Surface_Temperature/default/{Time}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png",
                projection: "EPSG:4326",
                layer: "GHRSST_L4_G1SST_Sea_Surface_Temperature",
                tileGrid: {
                    origin: [-180, 90],
                    resolutions: [
                        0.5624999999999999,
                        0.2812500000000001,
                        0.140625,
                        0.0703125,
                        0.035156250000000014,
                        0.017578125,
                        0.008789062499999998
                    ],
                    matrixIds: ["0", "1", "2", "3", "4", "5", "6"],
                    tileSize: 512,
                    minZoom: 0,
                    maxZoom: 6
                },
                format: "image/png"
            },
            opacity: 1,
            urlFunctions: {},
            url: "",
            metadata: { url: null, handleAs: "markdown" },
            units: "˚C",
            thumbnailImage:
                "http://gibs.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi?layer=GHRSST_L4_G1SST_Sea_Surface_Temperature&tilematrixset=1km&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image/png&TileMatrix=2&TileCol=0&TileRow=1&TIME=2015-05-20",
            isActive: false,
            min: 2,
            fromJson: true,
            updateParameters: { time: true },
            isDefault: true,
            title: "Sea Surface Temperature",
            handleAs: "GIBS_raster",
            type: "data",
            id: "GHRSST_L4_G1SST_Sea_Surface_Temperature",
            palette: {
                name: "GHRSST_L4_Sea_Surface_Temperature",
                url: "",
                handleAs: "json-relative",
                min: 0,
                max: 0
            },
            clusterVector: false
        }
    },
    reference: {
        Reference_Labels: {
            timeFormat: "YYYY-MM-DD",
            max: 0,
            isDisabled: false,
            displayIndex: 0,
            mappingOptions: {
                matrixSet: "250m",
                requestEncoding: "REST",
                extents: [-180, -90, 180, 90],
                urlFunctions: {},
                tileFunctions: {},
                url:
                    "http://gibs.earthdata.nasa.gov/wmts/epsg4326/best/Reference_Labels/default/{Time}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png",
                projection: "EPSG:4326",
                layer: "Reference_Labels",
                tileGrid: {
                    origin: [-180, 90],
                    resolutions: [
                        0.5624999999999999,
                        0.2812500000000001,
                        0.140625,
                        0.0703125,
                        0.035156250000000014,
                        0.017578125,
                        0.008789062499999998,
                        0.004394531249999999,
                        0.002197265625
                    ],
                    matrixIds: ["0", "1", "2", "3", "4", "5", "6", "7", "8"],
                    tileSize: 512,
                    minZoom: 0,
                    maxZoom: 8
                },
                format: "image/png"
            },
            opacity: 1,
            urlFunctions: {},
            url: "",
            metadata: { url: null, handleAs: "markdown" },
            units: "",
            thumbnailImage: "https://unsplash.it/700/400?image=1025",
            isActive: false,
            min: 0,
            fromJson: true,
            updateParameters: { time: true },
            isDefault: false,
            title: "Reference Labels",
            handleAs: "GIBS_raster",
            type: "reference",
            id: "Reference_Labels",
            palette: { name: "", url: "", handleAs: "", min: 0, max: 0 },
            clusterVector: false
        }
    },
    basemap: {
        BlueMarble_ShadedRelief_Bathymetry: {
            timeFormat: "YYYY-MM-DD",
            max: 0,
            isDisabled: false,
            displayIndex: 0,
            mappingOptions: {
                matrixSet: "500m",
                requestEncoding: "REST",
                extents: [-180, -90, 180, 90],
                urlFunctions: {},
                tileFunctions: {},
                url:
                    "http://gibs.earthdata.nasa.gov/wmts/epsg4326/best/BlueMarble_ShadedRelief_Bathymetry/default/{Time}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.jpeg",
                projection: "EPSG:4326",
                layer: "BlueMarble_ShadedRelief_Bathymetry",
                tileGrid: {
                    origin: [-180, 90],
                    resolutions: [
                        0.5624999999999999,
                        0.2812500000000001,
                        0.140625,
                        0.0703125,
                        0.035156250000000014,
                        0.017578125,
                        0.008789062499999998,
                        0.004394531249999999
                    ],
                    matrixIds: ["0", "1", "2", "3", "4", "5", "6", "7"],
                    tileSize: 512,
                    minZoom: 0,
                    maxZoom: 7
                },
                format: "image/jpeg"
            },
            opacity: 1,
            urlFunctions: {},
            url: "",
            metadata: { url: null, handleAs: "markdown" },
            units: "",
            thumbnailImage:
                "http://gibs.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi?layer=BlueMarble_ShadedRelief_Bathymetry&tilematrixset=500m&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image/jpeg&TileMatrix=2&TileCol=1&TileRow=1&TIME=2016-05-22",
            isActive: false,
            min: 0,
            fromJson: true,
            updateParameters: { time: true },
            isDefault: false,
            title: "GIBS Blue Marble, Shaded Relief w/Bathymetry",
            handleAs: "GIBS_raster",
            type: "basemap",
            id: "BlueMarble_ShadedRelief_Bathymetry",
            palette: { name: "", url: "", handleAs: "", min: 0, max: 0 },
            clusterVector: false
        },
        ESRI_World_Imagery: {
            timeFormat: "YYYY-MM-DD",
            max: 0,
            isDisabled: false,
            displayIndex: 0,
            mappingOptions: {
                matrixSet: undefined,
                requestEncoding: "KVP",
                extents: [-180, -90, 180, 90],
                urlFunctions: { openlayers: "esriCustom512" },
                tileFunctions: { openlayers: "catsTile" },
                url:
                    "http://services.arcgisonline.com/arcgis/rest/services/ESRI_Imagery_World_2D/MapServer/tile/{z}/{y}/{x}",
                projection: "EPSG:4326",
                layer: "ESRI_World_Imagery",
                tileGrid: {
                    origin: [-180, 90],
                    resolutions: [],
                    matrixIds: [],
                    tileSize: 512,
                    minZoom: 1,
                    maxZoom: 16
                },
                format: "image/png"
            },
            opacity: 1,
            urlFunctions: {},
            url: "",
            metadata: { url: null, handleAs: "markdown" },
            units: "",
            thumbnailImage:
                "http://gibs.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi?layer=BlueMarble_ShadedRelief_Bathymetry&tilematrixset=500m&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image/jpeg&TileMatrix=2&TileCol=1&TileRow=1&TIME=2016-05-22",
            isActive: false,
            min: 0,
            fromJson: true,
            updateParameters: { time: true },
            isDefault: true,
            title: "ESRI High Resolution World Imagery",
            handleAs: "xyz",
            type: "basemap",
            id: "ESRI_World_Imagery",
            palette: { name: "", url: "", handleAs: "", min: 0, max: 0 },
            clusterVector: false
        }
    }
};

export const PALETTES = {
    medspiration: {
        id: "medspiration",
        values: [
            { value: "0", color: "#FFFFFF" },
            { value: "0.004", color: "#FFFAFF" },
            { value: "0.008", color: "#FFF5FF" },
            { value: "0.012", color: "#FFECFF" },
            { value: "0.016", color: "#FFE7FF" },
            { value: "0.02", color: "#FFE2FF" },
            { value: "0.024", color: "#FFDEFF" },
            { value: "0.028", color: "#FFD9FF" },
            { value: "0.031", color: "#FFD4FF" },
            { value: "0.035", color: "#FFCFFF" },
            { value: "0.039", color: "#FFCAFF" },
            { value: "0.043", color: "#FFC6FF" },
            { value: "0.047", color: "#FFC1FF" },
            { value: "0.051", color: "#FFBCFF" },
            { value: "0.055", color: "#FFB7FF" },
            { value: "0.059", color: "#FFB3FF" },
            { value: "0.063", color: "#FFAEFF" },
            { value: "0.067", color: "#FFA9FF" },
            { value: "0.071", color: "#FFA4FF" },
            { value: "0.075", color: "#FFA0FF" },
            { value: "0.079", color: "#FF9BFF" },
            { value: "0.083", color: "#FF96FF" },
            { value: "0.087", color: "#FF91FF" },
            { value: "0.091", color: "#FF8CFF" },
            { value: "0.094", color: "#FF88FF" },
            { value: "0.098", color: "#FF83FF" },
            { value: "0.102", color: "#FF7EFF" },
            { value: "0.106", color: "#FF79FF" },
            { value: "0.11", color: "#FF75FF" },
            { value: "0.114", color: "#FF70FF" },
            { value: "0.118", color: "#FF6BFF" },
            { value: "0.122", color: "#FF66FF" },
            { value: "0.126", color: "#F963FA" },
            { value: "0.13", color: "#F261F5" },
            { value: "0.134", color: "#EB5EEF" },
            { value: "0.138", color: "#E55CEA" },
            { value: "0.142", color: "#DE59E5" },
            { value: "0.146", color: "#D856DF" },
            { value: "0.15", color: "#D154DA" },
            { value: "0.154", color: "#CA51D5" },
            { value: "0.157", color: "#C44ED0" },
            { value: "0.161", color: "#BD4CCA" },
            { value: "0.165", color: "#B649C5" },
            { value: "0.169", color: "#B046C0" },
            { value: "0.173", color: "#A944BA" },
            { value: "0.177", color: "#A341B5" },
            { value: "0.181", color: "#9C3EB0" },
            { value: "0.185", color: "#953CAA" },
            { value: "0.189", color: "#8F39A5" },
            { value: "0.193", color: "#8836A0" },
            { value: "0.197", color: "#82349B" },
            { value: "0.201", color: "#7B3195" },
            { value: "0.205", color: "#742F90" },
            { value: "0.209", color: "#6E2C8B" },
            { value: "0.213", color: "#672985" },
            { value: "0.217", color: "#602780" },
            { value: "0.22", color: "#5A247B" },
            { value: "0.224", color: "#532176" },
            { value: "0.228", color: "#4D1F70" },
            { value: "0.232", color: "#461C6B" },
            { value: "0.236", color: "#3F1966" },
            { value: "0.24", color: "#391760" },
            { value: "0.244", color: "#32145B" },
            { value: "0.248", color: "#2B1156" },
            { value: "0.252", color: "#250F50" },
            { value: "0.256", color: "#1E0C4B" },
            { value: "0.26", color: "#180946" },
            { value: "0.264", color: "#110741" },
            { value: "0.268", color: "#0A043B" },
            { value: "0.272", color: "#040136" },
            { value: "0.276", color: "#000335" },
            { value: "0.28", color: "#000A3B" },
            { value: "0.283", color: "#001140" },
            { value: "0.287", color: "#001746" },
            { value: "0.291", color: "#001E4B" },
            { value: "0.295", color: "#002550" },
            { value: "0.299", color: "#002C56" },
            { value: "0.303", color: "#00325B" },
            { value: "0.307", color: "#003961" },
            { value: "0.311", color: "#004066" },
            { value: "0.315", color: "#00476C" },
            { value: "0.319", color: "#004D71" },
            { value: "0.323", color: "#005476" },
            { value: "0.327", color: "#005B7C" },
            { value: "0.331", color: "#006281" },
            { value: "0.335", color: "#006887" },
            { value: "0.339", color: "#006F8C" },
            { value: "0.343", color: "#007691" },
            { value: "0.346", color: "#007D97" },
            { value: "0.35", color: "#00849C" },
            { value: "0.354", color: "#008AA2" },
            { value: "0.358", color: "#0091A7" },
            { value: "0.362", color: "#0098AC" },
            { value: "0.366", color: "#009FB2" },
            { value: "0.37", color: "#00A5B7" },
            { value: "0.374", color: "#00ACBD" },
            { value: "0.378", color: "#00B3C2" },
            { value: "0.382", color: "#00BAC8" },
            { value: "0.386", color: "#00C0CD" },
            { value: "0.39", color: "#00C7D2" },
            { value: "0.394", color: "#00CED8" },
            { value: "0.398", color: "#00D5DD" },
            { value: "0.402", color: "#00DBE3" },
            { value: "0.406", color: "#00E2E8" },
            { value: "0.409", color: "#00E9ED" },
            { value: "0.413", color: "#00F0F3" },
            { value: "0.417", color: "#00F7F8" },
            { value: "0.421", color: "#00FDFE" },
            { value: "0.425", color: "#00FDFA" },
            { value: "0.429", color: "#00F9F4" },
            { value: "0.433", color: "#00F6EE" },
            { value: "0.437", color: "#00F3E8" },
            { value: "0.441", color: "#00F0E2" },
            { value: "0.445", color: "#00EDDC" },
            { value: "0.449", color: "#00EAD6" },
            { value: "0.453", color: "#00E6D0" },
            { value: "0.457", color: "#00E3C9" },
            { value: "0.461", color: "#00E0C3" },
            { value: "0.465", color: "#00DDBD" },
            { value: "0.469", color: "#00DAB7" },
            { value: "0.472", color: "#00D7B1" },
            { value: "0.476", color: "#00D3AB" },
            { value: "0.48", color: "#00D0A5" },
            { value: "0.484", color: "#00CD9F" },
            { value: "0.488", color: "#00CA98" },
            { value: "0.492", color: "#00C792" },
            { value: "0.496", color: "#00C48C" },
            { value: "0.5", color: "#00C086" },
            { value: "0.504", color: "#00BD80" },
            { value: "0.508", color: "#00BA7A" },
            { value: "0.512", color: "#00B774" },
            { value: "0.516", color: "#00B46E" },
            { value: "0.52", color: "#00B167" },
            { value: "0.524", color: "#00AD61" },
            { value: "0.528", color: "#00AA5B" },
            { value: "0.531", color: "#00A755" },
            { value: "0.535", color: "#00A44F" },
            { value: "0.539", color: "#00A149" },
            { value: "0.543", color: "#009D43" },
            { value: "0.547", color: "#009A3C" },
            { value: "0.551", color: "#009736" },
            { value: "0.555", color: "#009430" },
            { value: "0.559", color: "#00912A" },
            { value: "0.563", color: "#008E24" },
            { value: "0.567", color: "#008A1E" },
            { value: "0.571", color: "#008718" },
            { value: "0.575", color: "#008412" },
            { value: "0.579", color: "#00810B" },
            { value: "0.583", color: "#007E05" },
            { value: "0.587", color: "#017100" },
            { value: "0.591", color: "#077500" },
            { value: "0.594", color: "#0E7900" },
            { value: "0.598", color: "#157C00" },
            { value: "0.602", color: "#1B8000" },
            { value: "0.606", color: "#228400" },
            { value: "0.61", color: "#288700" },
            { value: "0.614", color: "#2F8B00" },
            { value: "0.618", color: "#358F00" },
            { value: "0.622", color: "#3C9200" },
            { value: "0.626", color: "#439600" },
            { value: "0.63", color: "#499A00" },
            { value: "0.634", color: "#509D00" },
            { value: "0.638", color: "#56A100" },
            { value: "0.642", color: "#5DA500" },
            { value: "0.646", color: "#63A800" },
            { value: "0.65", color: "#6AAC00" },
            { value: "0.654", color: "#71B000" },
            { value: "0.657", color: "#77B300" },
            { value: "0.661", color: "#7EB700" },
            { value: "0.665", color: "#84BB00" },
            { value: "0.669", color: "#8BBE00" },
            { value: "0.673", color: "#91C200" },
            { value: "0.677", color: "#98C600" },
            { value: "0.681", color: "#9FC900" },
            { value: "0.685", color: "#A5CD00" },
            { value: "0.689", color: "#ACD100" },
            { value: "0.693", color: "#B2D400" },
            { value: "0.697", color: "#B9D800" },
            { value: "0.701", color: "#BFDC00" },
            { value: "0.705", color: "#C6DF00" },
            { value: "0.709", color: "#CDE300" },
            { value: "0.713", color: "#D3E700" },
            { value: "0.717", color: "#DAEA00" },
            { value: "0.72", color: "#E0EE00" },
            { value: "0.724", color: "#E7F200" },
            { value: "0.728", color: "#EDF500" },
            { value: "0.732", color: "#F4F900" },
            { value: "0.736", color: "#FBFD00" },
            { value: "0.74", color: "#FFFD00" },
            { value: "0.744", color: "#FFF500" },
            { value: "0.748", color: "#FFED00" },
            { value: "0.752", color: "#FFE500" },
            { value: "0.756", color: "#FFDE00" },
            { value: "0.76", color: "#FFD600" },
            { value: "0.764", color: "#FFCE00" },
            { value: "0.768", color: "#FFC700" },
            { value: "0.772", color: "#FFBF00" },
            { value: "0.776", color: "#FFB700" },
            { value: "0.78", color: "#FFAF00" },
            { value: "0.783", color: "#FFA800" },
            { value: "0.787", color: "#FFA000" },
            { value: "0.791", color: "#FF9800" },
            { value: "0.795", color: "#FF9100" },
            { value: "0.799", color: "#FF8900" },
            { value: "0.803", color: "#FF8100" },
            { value: "0.807", color: "#FF7900" },
            { value: "0.811", color: "#FF7200" },
            { value: "0.815", color: "#FF6A00" },
            { value: "0.819", color: "#FF6200" },
            { value: "0.823", color: "#FF5B00" },
            { value: "0.827", color: "#FF5300" },
            { value: "0.831", color: "#FF4B00" },
            { value: "0.835", color: "#FF4300" },
            { value: "0.839", color: "#FF3C00" },
            { value: "0.843", color: "#FF3400" },
            { value: "0.846", color: "#FF2C00" },
            { value: "0.85", color: "#FF2500" },
            { value: "0.854", color: "#FF1D00" },
            { value: "0.858", color: "#FF1500" },
            { value: "0.862", color: "#FF0D00" },
            { value: "0.866", color: "#FF0600" },
            { value: "0.87", color: "#FD0000" },
            { value: "0.874", color: "#F70000" },
            { value: "0.878", color: "#F10000" },
            { value: "0.882", color: "#EB0000" },
            { value: "0.886", color: "#E50000" },
            { value: "0.89", color: "#DF0000" },
            { value: "0.894", color: "#D80000" },
            { value: "0.898", color: "#D20000" },
            { value: "0.902", color: "#CC0000" },
            { value: "0.906", color: "#C60000" },
            { value: "0.909", color: "#C00000" },
            { value: "0.913", color: "#BA0000" },
            { value: "0.917", color: "#B30000" },
            { value: "0.921", color: "#AD0000" },
            { value: "0.925", color: "#A70000" },
            { value: "0.929", color: "#A10000" },
            { value: "0.933", color: "#9B0000" },
            { value: "0.937", color: "#950000" },
            { value: "0.941", color: "#8E0000" },
            { value: "0.945", color: "#880000" },
            { value: "0.949", color: "#820000" },
            { value: "0.953", color: "#7C0000" },
            { value: "0.957", color: "#760000" },
            { value: "0.961", color: "#700000" },
            { value: "0.965", color: "#690000" },
            { value: "0.969", color: "#630000" },
            { value: "0.972", color: "#5D0000" },
            { value: "0.976", color: "#570000" },
            { value: "0.98", color: "#510000" },
            { value: "0.984", color: "#4B0000" },
            { value: "0.988", color: "#440000" },
            { value: "0.992", color: "#3E0000" },
            { value: "1", color: "#3E0000" }
        ]
    }
};
