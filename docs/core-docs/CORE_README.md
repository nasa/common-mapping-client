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
under our [Example Projects](EXAMPLE_PROJECTS.md) for others to find inspiration in.

If you create a particularly useful or robust widget in your own CMC descendant,
please create an example project demonstrating just that widget so that others
who have the same problem down the road may find a solution faster.

### Documentation Shortcut

* [Walkthrough](https://github.com/AaronPlave/common-mapping-client-walkthrough)
* [Developer Guide](DEVELOPER_MANUAL.md)
* [Example Projects](EXAMPLE_PROJECTS.md)
