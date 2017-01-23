[![Build Status](https://travis.jpl.nasa.gov/CommonMappingClient/cmc-core.svg?token=kcPVkrUjSKF8FJtoQYEw&branch=master)](https://travis.jpl.nasa.gov/CommonMappingClient/cmc-core)

# Common Mapping Client Core README

## Welcome to the Common Mapping Client 2.0!

#### Overview

The Common Mapping Client (CMC) aims to solve the problem of redundant and unshared
code in web-based scientific mapping applications.

Over the years, there have been many projects that try to solve the same issue:
put data on a map and explore it. Unfortunately, there is an increasingly steep
hill to climb when it comes to actually starting one of these projects. All of
them have to decide: Which framework should I start from? Which library
will give me the features I need? How to I glue all these together with 
a code layout that I won't want to burn next week? CMC solves this by bundling
together a solid and modular base framework with robust mapping libraries,
a well thought out structure, and a thick shield against feature-creep
to deliver what is essentially a starter project for mapping that will let
you start building the cool stuff faster.

We maintain a list of further example projects and projects that began from CMC
so that you can easily get examples of building intricate and detailed workflows
on top of our client.

#### General Philosophy

If a capability or widget is not in 85% of mapping applications, it will not be
part of CMC-Core.

#### Live Demo
- Check out our live demo http://graywhale:49160/
- GHE gh-page demo: https://github.jpl.nasa.gov/pages/CommonMappingClient/cmc-core/branches/master/
- GHE code-coverage: https://github.jpl.nasa.gov/pages/CommonMappingClient/cmc-core/branches/master/code-coverage
- GHE unit test report: https://github.jpl.nasa.gov/pages/CommonMappingClient/cmc-core/branches/master/unit-tests

![Preview](https://github.jpl.nasa.gov/CommonMappingClient/cmc-design/blob/master/screenshots/core.png)

#### Getting Started 

1. Install `NodeJS`
2. Get the code
   1. Option A: Grab a tag that suits you
   2. Option B: Fork the repo into your new project and get the cutting edge goodness
   3. Option C: Clone the repo, contribute back, and get the cutting edge goodness
3. Run `npm install`
4. Run `npm start`
5. Start building.

#### Contributing to the Project

*Contributing Directly to CMC-Core*

You are more than welcome to create forks to fix bugs, add features or
enhancements or otherwise improve the tool.

*Contributing to the CMC Ecosystem*

If you use CMC for your own project, please let us know so that we may list it
under our [Example Projects](https://github.jpl.nasa.gov/CommonMappingClient/cmc-core/blob/master/docs/core-docs/EXAMPLE_PROJECTS.md) for others to find inspiration in.

If you create a particularly useful or robust widget in your own CMC descendant,
please create an example project demonstrating just that widget so that others
who have the same problem down the road may find a solution faster.

#### Documentation Shortcut

* [FAQ](https://github.jpl.nasa.gov/CommonMappingClient/cmc-core/blob/master/docs/core-docs/FAQ.md)
* [Developer Guide](https://github.jpl.nasa.gov/CommonMappingClient/cmc-core/blob/master/docs/core-docs/DEVELOPER_MANUAL.md)
* [Example Projects](https://github.jpl.nasa.gov/CommonMappingClient/cmc-core/blob/master/docs/core-docs/EXAMPLE_PROJECTS.md)
