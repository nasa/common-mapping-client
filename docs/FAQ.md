### Quick Installation
* `npm3 install`
* `npm start`

### Build for Production
* `npm run build`

### What is CMC?
The Common Mapping Client is a foundation for web based mapping applications that leverages, combines, and abstracts certain commonly used mapping functionalities, enabling developers to spend less time reinventing the wheel and more time solving their specific problems.

### Where did this project start?
CMC was born in 2014 and used Dojo as its underlying framework. After much
fragmentation and slapdash development, a new effort was undertaken in 2016
to create a stable and forward-thinking re-implementation of CMC using
React/Redux. This project used [React Slingshot](https://github.com/coryhouse/react-slingshot)
as a starting point. See it's documentation for more info.

### How do you determine what features should or shouldn't be in CMC?
CMC is not a final, user-facing application. CMC is a foundation on which to build more specific applications. Because of that, what is and is not part of the CMC core is an ongoing discussion, but the general idea is that if the majority of applications CMC is intended to support require a certain functionality, (such as shareable urls or setting layer opacity), then CMC should include it. It is important to be able to exclude certain functionalities from CMC in order to keep CMC as thin as possible, that way developers can spend more time creating and less time removing unwanted features.

### What are the Example projects in CMC?
Example projects are small applications that build one or two features on top of CMC. We use the example projects to demonstrate:

* CMC's flexibility and power
* How a feature could be integrated into your project
* Explore new techniques of data vizualization and interaction
* Explore new User interactions and workflows

### What are the major functionalities CMC provides?
* 2D/3D Map library abstraction
* Map layer ingestion and merging (from JSON and WMTS capabilities XML)
* Highly customizable user analytics
* Configurable map projection
* Vector layer support
* Map extent synchronization across all maps (2D and 3D)
* Global time, time widget, and interactive timeslider
* Adjustable map layer cache
* Shareable/loadable application state via url parameters with share widget (facebook, twitter, email, google plus)
* Core set of UI elements necessary for most basic applications
* Basemap switching
* Basic shape drawing tools in 2D and 3D
* Display help documentation from markdown files


