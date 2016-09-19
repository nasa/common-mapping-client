import { expect } from 'chai';
import Immutable from 'immutable';
import MapUtil from '../utils/MapUtil';

describe('Map Utils', () => {
    describe('constrainCoordinates', () => {
        it('takes in a set of LatLon coordinates [lon,lat] that may be outside ' +
            'the [-180, -90, 180, 90] bounds and contrains them the the [-180, -90, 180, 90] bounds.', () => {
                let varIn = [190, -100];
                let varOut = [-170, -90];

                //assert
                expect(MapUtil.constrainCoordinates(varIn)).to.deep.equal(varOut);
            });
        it('Wraps longitude values outside [-180, 180] around the [-180, 180] line', () => {
            let varIn1 = [270, 50];
            let varOut1 = [-90, 50];

            let varIn2 = [-270, 50];
            let varOut2 = [90, 50];

            let varIn3 = [321, 50];
            let varOut3 = [-39, 50];

            //assert
            expect(MapUtil.constrainCoordinates(varIn1)).to.deep.equal(varOut1);
            expect(MapUtil.constrainCoordinates(varIn2)).to.deep.equal(varOut2);
            expect(MapUtil.constrainCoordinates(varIn3)).to.deep.equal(varOut3);
        });
        it('Limits latitude values outside [-90, 90] to the [-90, 90] line', () => {
            let varIn1 = [50, 270];
            let varOut1 = [50, 90];

            let varIn2 = [50, -270];
            let varOut2 = [50, -90];

            let varIn3 = [50, 321];
            let varOut3 = [50, 90];

            //assert
            expect(MapUtil.constrainCoordinates(varIn1)).to.deep.equal(varOut1);
            expect(MapUtil.constrainCoordinates(varIn2)).to.deep.equal(varOut2);
            expect(MapUtil.constrainCoordinates(varIn3)).to.deep.equal(varOut3);
        });
        it('Leaves coordinates within the [-180, -90, 180, 90] unchanged', () => {
            let varIn1 = [50, 50];
            let varOut1 = [50, 50];

            let varIn2 = [180, 90];
            let varOut2 = [180, 90];

            let varIn3 = [-180, -90];
            let varOut3 = [-180, -90];

            let varIn4 = [0, 0];
            let varOut4 = [0, 0];

            //assert
            expect(MapUtil.constrainCoordinates(varIn1)).to.deep.equal(varOut1);
            expect(MapUtil.constrainCoordinates(varIn2)).to.deep.equal(varOut2);
            expect(MapUtil.constrainCoordinates(varIn3)).to.deep.equal(varOut3);
            expect(MapUtil.constrainCoordinates(varIn4)).to.deep.equal(varOut4);
        });
        it('Returns false with bad input', () => {
            let varIn1 = "cats";
            let varOut1 = false;

            let varIn2 = ["cats", "dogs"];
            let varOut2 = false;

            //assert
            expect(MapUtil.constrainCoordinates(varIn1)).to.deep.equal(varOut1);
            expect(MapUtil.constrainCoordinates(varIn2)).to.deep.equal(varOut2);
        });
    });
    describe('buildTileUrl', () => {
        it('takes in a set WMTS url params and returns a valid WMTS tile url.', () => {
            let varIn = {
                url: "http://fakeTile.com/getTile",
                layerId: "layerId",
                tileMatrixSet: "tileMatrixSet",
                col: 0,
                row: 0,
                level: 0,
                format: "format"
            };
            let varOut = 'http://fakeTile.com/getTile?tilerow=0&request=GetTile&tilematrix=0&layer=layerId&tilecol=0&tilematrixset=tileMatrixSet&service=WMTS&format=format&version=1.0.0';

            //assert
            expect(MapUtil.buildTileUrl(varIn)).to.equal(varOut);
        });
        it('Accepts a restful url and populates the provided fields.', () => {
            let varIn = {
                url: "http://fakeTile.com/getTile/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}",
                layerId: "layerId",
                tileMatrixSet: "tileMatrixSetStr",
                col: 0,
                row: 0,
                level: 0,
                format: "format"
            };
            let varOut = 'http://fakeTile.com/getTile/tileMatrixSetStr/0/0/0';

            //assert
            expect(MapUtil.buildTileUrl(varIn)).to.equal(varOut);
        });
    });
    describe('formatDistance', () => {
        it('fails on bad input', () => {
            expect(MapUtil.formatDistance(null, null)).to.equal(null);
            expect(MapUtil.formatDistance(null, 'cats')).to.equal(null);
            expect(MapUtil.formatDistance(null, 'metric')).to.equal(null);
            expect(MapUtil.formatDistance('cats', 'metric')).to.equal(null);
            expect(MapUtil.formatDistance([0, 1, 2], 'metric')).to.equal(null);
        });
        it('formats distance in meters', () => {
            expect(MapUtil.formatDistance(0, 'metric')).to.equal('0 m');
            expect(MapUtil.formatDistance(0.001, 'metric')).to.equal('0 m');
            expect(MapUtil.formatDistance(0.01, 'metric')).to.equal('0.01 m');
            expect(MapUtil.formatDistance(100, 'metric')).to.equal('100 m');
        });
        it('formats distance in kilometers', () => {
            expect(MapUtil.formatDistance(100.001, 'metric')).to.equal('0.1 km');
            expect(MapUtil.formatDistance(100.01, 'metric')).to.equal('0.1 km');
            expect(MapUtil.formatDistance(10000000, 'metric')).to.equal('10000 km');
        });
        it('formats distance in feet', () => {
            expect(MapUtil.formatDistance(0, 'imperial')).to.equal('0 ft');
            expect(MapUtil.formatDistance(0.001, 'imperial')).to.equal('0 ft');
            expect(MapUtil.formatDistance(0.01, 'imperial')).to.equal('0.01 ft');
            expect(MapUtil.formatDistance(5280, 'imperial')).to.equal('5280 ft');
        });
        it('formats distance in miles', () => {
            expect(MapUtil.formatDistance(5280.001, 'imperial')).to.equal('1 miles');
            expect(MapUtil.formatDistance(5280.01, 'imperial')).to.equal('1 miles');
            expect(MapUtil.formatDistance(5281, 'imperial')).to.equal('1 miles');
            expect(MapUtil.formatDistance(5281000, 'imperial')).to.equal('1000.19 miles');
        });
        it('formats distance in nautical', () => {
            expect(MapUtil.formatDistance(0, 'nautical')).to.equal('0 nautical miles');
            expect(MapUtil.formatDistance(0.001, 'nautical')).to.equal('0 nautical miles');
            expect(MapUtil.formatDistance(0.01, 'nautical')).to.equal('0 nautical miles');
            expect(MapUtil.formatDistance(1852, 'nautical')).to.equal('1 nautical miles');
            expect(MapUtil.formatDistance(1852.01, 'nautical')).to.equal('1 nautical miles');
            expect(MapUtil.formatDistance(1933, 'nautical')).to.equal('1.04 nautical miles');
            expect(MapUtil.formatDistance(100000, 'nautical')).to.equal('54 nautical miles');
        });
        it('formats distance in schoolbus', () => {
            expect(MapUtil.formatDistance(0, 'schoolbus')).to.equal('0 schoolbusses');
            expect(MapUtil.formatDistance(0.001, 'schoolbus')).to.equal('0 schoolbusses');
            expect(MapUtil.formatDistance(0.01, 'schoolbus')).to.equal('0 schoolbusses');
            expect(MapUtil.formatDistance(13.716, 'schoolbus')).to.equal('1 schoolbusses');
            expect(MapUtil.formatDistance(13.7165, 'schoolbus')).to.equal('1 schoolbusses');
            expect(MapUtil.formatDistance(27.432, 'schoolbus')).to.equal('2 schoolbusses');
            expect(MapUtil.formatDistance(100000, 'schoolbus')).to.equal('7290.76 schoolbusses');
        });
    });
    describe('formatArea', () => {
        it('fails on bad input', () => {
            expect(MapUtil.formatArea(null, null)).to.equal(null);
            expect(MapUtil.formatArea(null, 'cats')).to.equal(null);
            expect(MapUtil.formatArea(null, 'metric')).to.equal(null);
            expect(MapUtil.formatArea('cats', 'metric')).to.equal(null);
            expect(MapUtil.formatArea([0, 1, 2], 'metric')).to.equal(null);
        });
        it('formats area in meters squared', () => {
            expect(MapUtil.formatArea(0, 'metric')).to.equal('0 m<sup>2</sup>');
            expect(MapUtil.formatArea(0.001, 'metric')).to.equal('0 m<sup>2</sup>');
            expect(MapUtil.formatArea(0.01, 'metric')).to.equal('0.01 m<sup>2</sup>');
            expect(MapUtil.formatArea(100, 'metric')).to.equal('100 m<sup>2</sup>');
        });
        it('formats area in kilometers squared', () => {
            expect(MapUtil.formatArea(10000.1, 'metric')).to.equal('0.01 km<sup>2</sup>');
            expect(MapUtil.formatArea(100000, 'metric')).to.equal('0.1 km<sup>2</sup>');
        });
        it('formats area in feet squared', () => {
            expect(MapUtil.formatArea(0, 'imperial')).to.equal('0 ft<sup>2</sup>');
            expect(MapUtil.formatArea(0.001, 'imperial')).to.equal('0 ft<sup>2</sup>');
            expect(MapUtil.formatArea(0.01, 'imperial')).to.equal('0.01 ft<sup>2</sup>');
            expect(MapUtil.formatArea(5280, 'imperial')).to.equal('5280 ft<sup>2</sup>');
        });
        it('formats area in miles squared', () => {
            expect(MapUtil.formatArea(27878400.001, 'imperial')).to.equal('1 miles');
            expect(MapUtil.formatArea(27878400.01, 'imperial')).to.equal('1 miles');
            expect(MapUtil.formatArea(27878400, 'imperial')).to.equal('1 miles');
            expect(MapUtil.formatArea(27878400, 'imperial')).to.equal('1000.19 miles');
        });
        it('formats area in nautical miles squared', () => {
            expect(MapUtil.formatArea(0, 'nautical')).to.equal('0 nautical miles');
            expect(MapUtil.formatArea(0.001, 'nautical')).to.equal('0 nautical miles');
            expect(MapUtil.formatArea(0.01, 'nautical')).to.equal('0 nautical miles');
            expect(MapUtil.formatArea(1852, 'nautical')).to.equal('1 nautical miles');
            expect(MapUtil.formatArea(1852.01, 'nautical')).to.equal('1 nautical miles');
            expect(MapUtil.formatArea(1933, 'nautical')).to.equal('1.04 nautical miles');
            expect(MapUtil.formatArea(100000, 'nautical')).to.equal('54 nautical miles');
        });
        it('formats area in schoolbus squared', () => {
            expect(MapUtil.formatArea(0, 'schoolbus')).to.equal('0 schoolbusses');
            expect(MapUtil.formatArea(0.001, 'schoolbus')).to.equal('0 schoolbusses');
            expect(MapUtil.formatArea(0.01, 'schoolbus')).to.equal('0 schoolbusses');
            expect(MapUtil.formatArea(13.716, 'schoolbus')).to.equal('1 schoolbusses');
            expect(MapUtil.formatArea(13.7165, 'schoolbus')).to.equal('1 schoolbusses');
            expect(MapUtil.formatArea(27.432, 'schoolbus')).to.equal('2 schoolbusses');
            expect(MapUtil.formatArea(100000, 'schoolbus')).to.equal('7290.76 schoolbusses');
        });
    });
    describe('convertDistanceUnits', () => {
        it('fails', () => {
            expect(1).to.equal(0);
        });
    });
    describe('convertAreaUnits', () => {
        it('fails', () => {
            expect(1).to.equal(0);
        });
    });
    describe('calculatePolylineDistance', () => {
        it('fails on null coordinate input', () => {
            let proj = "EPSG:4326";
            let bad1 = [null, null];
            let bad2 = [null, null];
            let varIn = [bad1, bad2];
            let varOut = 0;
            let actualOut = MapUtil.calculatePolylineDistance(varIn, proj);

            expect(Math.floor(actualOut)).to.equal(varOut);
        });
        it('calculates distances with two identical points', () => {
            let proj = "EPSG:4326";
            let sfCoords = [-122.431, 37.732];
            let sfCoords2 = [-122.431, 37.732];
            let varIn = [sfCoords, sfCoords2];
            let varOut = 0;
            let actualOut = MapUtil.calculatePolylineDistance(varIn, proj);

            expect(Math.floor(actualOut)).to.equal(varOut);
        });
        it('calculates distances with two points', () => {
            let proj = "EPSG:4326";
            let sfCoords = [-122.431, 37.732];
            let manhattanCoords = [-73.948, 40.682];
            let varIn = [sfCoords, manhattanCoords];
            let varOut = 4138463;
            let actualOut = MapUtil.calculatePolylineDistance(varIn, proj);

            expect(Math.floor(actualOut)).to.equal(varOut);
        });
        it('fails', () => {
            expect(1).to.equal(0);
        });
    });
    describe('calculatePolygonArea', () => {
        it('fails', () => {
            expect(1).to.equal(0);
        });
    });
    describe('calculatePolygonCenter', () => {
        it('fails', () => {
            expect(1).to.equal(0);
        });
    });
});
