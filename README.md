## Welcome to the Common Mapping Client!

[![CircleCI](https://circleci.com/gh/nasa/common-mapping-client.svg?style=shield)](https://circleci.com/gh/nasa/common-mapping-client)
[![Dependencies Status](https://david-dm.org/nasa/common-mapping-client/status.svg)](https://david-dm.org/nasa/common-mapping-client)
[![Coverage Status](https://coveralls.io/repos/github/nasa/common-mapping-client/badge.svg?branch=master)](https://coveralls.io/github/nasa/common-mapping-client?branch=master)
[![license](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](http://www.apache.org/licenses/LICENSE-2.0)


[![Preview](https://raw.githubusercontent.com/nasa/common-mapping-client/master/docs/core-docs/resources/screenshot_core.jpg)](https://nasa.github.io/common-mapping-client/branches/master/)

### Overview
The Common Mapping Client (CMC) is a foundation for web-based mapping applications that
leverages, combines, and abstracts certain commonly used mapping functionalities,
enabling developers to spend less time reinventing the wheel and more time solving
their specific problems. Sitting somewhere between a starter-kit and a framework,
CMC aims fulfill the basic needs of a mapping application without getting in the
way of any given project's unique goals.

Over the years, there have been many projects that try to solve the same issue:
put data on a map and explore it. Unfortunately, there is an increasingly steep
hill to climb when it comes to actually starting one of these projects. All of
them have to decide: Which framework should I start from? Which library
will give me the features I need? How to I glue all these together with 
a code layout that I won't want to burn next week? CMC solves this by bundling
together a solid and modular base framework with robust mapping libraries,
a well thought out structure, and a thick shield against feature-creep
to let you start building the cool stuff faster.

We maintain a list of further example projects and projects that began from CMC
so that you can easily get examples of building intricate and detailed workflows
on top of this tool.

View our [live demo](https://nasa.github.io/common-mapping-client/branches/master/).

### Features
* 2D/3D Map library abstraction
* Map layer controls
* Map layer ingestion and merging (from JSON and WMTS capabilities XML)
* Highly customizable user analytics
* Configurable map projection
* Basic vector layer support
* Map extent synchronization across all maps (2D and 3D)
* Geodesic map geometry synchronization across all maps (2D and 3D)
* Global time widget, and interactive timeslider
* Adjustable map layer cache
* Shareable/loadable application state via url parameters with share widget (facebook, twitter, email, google plus)
* Core set of UI elements necessary for most basic applications
* Basemap switching
* Basic shape drawing tools in 2D and 3D
* Basic geodesic measurement (distance and area) tools in 2D and 3D
* Display help documentation from markdown files
* A preconfigured testing framework
* A preconfigured build process
* Handy development tools
  * Hot reloading
  * Local dev and production node servers
  * BrowserSync

### Quickstart

##### Install
1. Install `NodeJS`
2. Get the code
   1. Option A: Grab a tag that suits you
   2. Option B: Fork the repo into your new project and get the cutting edge goodness
   3. Option C: Clone the repo, contribute back, and get the cutting edge goodness
3. `npm install`: install node dependencies
4. `npm start`: build and server development code bundle
5. Start building.

##### Build
* `npm run build`: build production code bundle
* `npm run open:dist`: serve production code bundle

##### Test
* `npm run test`: Single run of tests
* flags
  * `--includecoretests`: Include cmc-core tests as well
  * `--nowebgl`: Run tests in phantomJS and skip tests that require webgl
  * `--watch`: Run tests with code watch

### Contributing to the Project

*Contributing Directly to CMC-Core*

You are more than welcome to create forks to fix bugs, add features or
enhancements or otherwise improve the tool. Please submit these changes through
pull-requests for review.

*Contributing to the CMC Ecosystem*

If you use CMC for your own project, please let us know so that we may list it
under our [Example Projects](docs/core-docs/EXAMPLE_PROJECTS.md) for others to find inspiration in.

If you create a particularly useful or robust widget in your own CMC descendant,
please create an example project demonstrating just that widget so that others
who have the same problem down the road may find a solution faster.

### Documentation Shortcut

* [Walkthrough](https://github.com/AaronPlave/common-mapping-client-walkthrough)
* [Developer Guide](docs/core-docs/DEVELOPER_MANUAL.md)
* [Example Projects](docs/core-docs/EXAMPLE_PROJECTS.md)


### Documentation Ifremer
#### Layer Configs and Ingestion
The JSON format is an array of json entries that match the layer model used in the application (e.g. layerModel in src/reducers/models/map.js), we have overwritte the CORE layerModel (e.g. layerModel in src/_core/reducers/models/map.js) in order to manage some functionnalities.  

#### GeoJson Layers

Nexts configurations will be done in the layers configuration file `src/default-data/your-data-directory/layers.json`

GeoJson layer vector type as been added to easily add layers created from APIs that return data in GeoJson format. To use it, just declare `handleAs` as `vector_geojson_raster` and declare the API URL :

```JSON
{
    "layers": [
        {
            "id": "argo-eov-data-raster",
            "title": "1 Month Argo EOV data discovery",
            "type": "data",
            "handleAs": "vector_geojson_raster",
            "url": "http://api-argo.ifremer.fr/api/eosc/geojson?start={TIME_MIN}&end={TIME_MAX}",
            "timeFormat": "X",
            "metadata": {
                "url": "default-data/eosc-data/layer-metadata/argo_eov_data.json",
                "handleAs": "json"
            },
            "thumbnailImage": "img/argo_eosc_thumbnail.png",
            "updateParameters": {
                "time": true,
            }
        }
    ]
}
```

##### Add filters 
You can add filters to your layer, it's really interesting for layers created from APIs because the user can interact with layers request. To use this functionality you have to declare **filters** in update parameters were filters keys corresponding to API url parameter :

```JSON
{
    "layers": [
        {
            "url": "http://api-argo.ifremer.fr/api/eosc/geojson?start={TIME_MIN}&end={TIME_MAX}",
            "updateParameters": {
                "filters": {
                    "parameter" : {
                        "label": "Select parameter",
                        "value": "35",
                        "list": [
                            {"palette":"sea-surface-temp-ifremer", "label":"Sea temperature","code":"35"},
                            {"palette":"sea-surface-psal-ifremer","label":"Practical salinity","code":"30"}
                        ],
                        "type": "select"
                    },
                    "depth" : {
                        "label": "Select depth",
                        "value": "2000",
                        "list": [
                            {"label":"Sea surface","code":"0"},
                            {"label":"100 meters","code":"100"},
                            {"label":"2000 meters","code":"2000"},
                        ],
                        "type": "select"
                    }
                 }
            }
        }
    ]
}
```

`filters` : Map that describes the filters.
    `key` (here `parameter` or `depth`) : Key of the filter, must correspond to the parameter to add to the requesting url. 
        `label` : Label of the filter in the layer container.
        `type` : Type of the component in the layer container (only **checkboxe** and **select** implemented).
        `list` : List of options for **select** component type.
        `value` : Default value of the filter.

Example of URL requested from the previous layer configuration : <http://api-argo.ifremer.fr/api/eosc/geojson?start=1643324400&end=1646002800&parameter=35&depth=2000>

##### Bind color data 
You can also color your layer features according to a color palette. To do that you need to declare which filter will color data depending on a feature property returned by the layer URL : 

```JSON
{
    "layers": [
        {
            "bindingParameter":"parameter",
            "updateParameters": {
                "filters": {
                    "parameter" : {
                        "label": "Select parameter",
                        "property":"parameter_value",
                        "value": "35",
                        "list": [
                            {"palette":"sea-surface-temp-ifremer", "label":"Sea temperature","code":"35"},
                            {"palette":"sea-surface-psal-ifremer","label":"Practical salinity","code":"30"}
                        ],
                        "type": "select"
                    },
                 }
            },
        }
    ]
}
```

`bindingParameter` : Define which filter will be use to color the features.
`property` : The value of the defined property will be used to define the color of features.
`palette` : If you need to overwite the palette according to selected option.

Do not forget to declare the palettes used in the the palette configuration file `src/default-data/your-data-directory/pelettes.json` :  
```JSON
{
    "paletteArray": [
        {
            "name": "sea-surface-psal-ifremer",
            "values": [
                ["<= 32", "#2a186e"],
                ["32 - 32.5", "#2e1c90"],
                ["32.5 - 33", "#232ea2"],
                ["33 - 33.5", "#0d4b97"],
                ["33.5 - 34", "#15638d"],
                ["34 - 34.5", "#277689"],
                ["34.5 - 35", "#388d87"],
                ["35 - 35.5", "#47a682"],
                ["35.5 - 36", "#5cbb76"],
                ["36 - 36.5", "#88d060"],
                ["36.5 - 37", "#c7de67"],
                [">= 37", "#faed95"]
            ]
        }
    ]
}
```

##### Layer Popup onClick
I you want to share data with users, a new popup fonctionnality as been added on features click. To use it you need to define the mapping of the properties shared in the popup as follows :  

```JSON
{
    "layers": [
        {
            "mapping": {
                "title": "platform_code",
                "subtitle": "station_date",
                "properties": {
                    "parameter_code" : "Parameter code",
                    "parameter_value": "Parameter value",
                    "z_level": "depth level" ,
                    "z_value": "real depth"
                },
                "data": {
                    "label": "To profile data",
                    "link": "https://co-insitucharts.ifremer.fr/station/{IDENTIFIER}/",
                    "identifier": { "code": "station_id", "type": "number" }
                }
            }
        }
    ]
}
```

`mapping` : Mapping oh the properties in the popup.
    `title` : Feature property used as title.
    `subtitle` : Feature property used as title.
    `properties` : List the feature properties to share in the popup container.
        `key` (*parameter_code*) : Attribut corresponding to a property of the feature.
        `value` (*Parameter code*): Label of the property.
    `data` : allows to create a link to data related to this feature.
