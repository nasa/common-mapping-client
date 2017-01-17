'use strict';

let D2R = Math.PI / 180;
let R2D = 180 / Math.PI;

let Coord = function(lon,lat) {
    this.lon = lon;
    this.lat = lat;
    this.x = D2R * lon;
    this.y = D2R * lat;
};

Coord.prototype.view = function() {
    return String(this.lon).slice(0, 4) + ',' + String(this.lat).slice(0, 4);
};

Coord.prototype.antipode = function() {
    let anti_lat = -1 * this.lat;
    let anti_lon = (this.lon < 0) ? 180 + this.lon : (180 - this.lon) * -1;
    return new Coord(anti_lon, anti_lat);
};

let LineString = function() {
    this.coords = [];
    this.length = 0;
};

LineString.prototype.move_to = function(coord) {
    this.length++;
    this.coords.push(coord);
};

let Arc = function(properties) {
    this.properties = properties || {};
    this.geometries = [];
};

Arc.prototype.json = function() {
    if (this.geometries.length <= 0) {
        return {'geometry': { 'type': 'LineString', 'coordinates': null },
                'type': 'Feature', 'properties': this.properties
               };
    } else if (this.geometries.length == 1) {
        return {'geometry': { 'type': 'LineString', 'coordinates': this.geometries[0].coords },
                'type': 'Feature', 'properties': this.properties
               };
    } else {
        let multiline = [];
        for (let i = 0; i < this.geometries.length; i++) {
            multiline.push(this.geometries[i].coords);
        }
        return {'geometry': { 'type': 'MultiLineString', 'coordinates': multiline },
                'type': 'Feature', 'properties': this.properties
               };
    }
};

// TODO - output proper multilinestring
Arc.prototype.wkt = function() {
    let wkt_string = '';
    let wkt = 'LINESTRING(';
    let collect = function(c) { wkt += c[0] + ' ' + c[1] + ','; };
    for (let i = 0; i < this.geometries.length; i++) {
        if (this.geometries[i].coords.length === 0) {
            return 'LINESTRING(empty)';
        } else {
            let coords = this.geometries[i].coords;
            coords.forEach(collect);
            wkt_string += wkt.substring(0, wkt.length - 1) + ')';
        }
    }
    return wkt_string;
};

/*
 * http://en.wikipedia.org/wiki/Great-circle_distance
 *
 */
let GreatCircle = function(start,end,properties) {
    if (!start || start.x === undefined || start.y === undefined) {
        throw new Error("GreatCircle constructor expects two args: start and end objects with x and y properties");
    }
    if (!end || end.x === undefined || end.y === undefined) {
        throw new Error("GreatCircle constructor expects two args: start and end objects with x and y properties");
    }
    this.start = new Coord(start.x,start.y);
    this.end = new Coord(end.x,end.y);
    this.properties = properties || {};

    let w = this.start.x - this.end.x;
    let h = this.start.y - this.end.y;
    let z = Math.pow(Math.sin(h / 2.0), 2) +
                Math.cos(this.start.y) *
                   Math.cos(this.end.y) *
                     Math.pow(Math.sin(w / 2.0), 2);
    this.g = 2.0 * Math.asin(Math.sqrt(z));

    if (this.g == Math.PI) {
        throw new Error('it appears ' + start.view() + ' and ' + end.view() + " are 'antipodal', e.g diametrically opposite, thus there is no single route but rather infinite");
    } else if (isNaN(this.g)) {
        throw new Error('could not calculate great circle between ' + start + ' and ' + end);
    }
};

/*
 * http://williams.best.vwh.net/avform.htm#Intermediate
 */
GreatCircle.prototype.interpolate = function(f) {
    let A = Math.sin((1 - f) * this.g) / Math.sin(this.g);
    let B = Math.sin(f * this.g) / Math.sin(this.g);
    let x = A * Math.cos(this.start.y) * Math.cos(this.start.x) + B * Math.cos(this.end.y) * Math.cos(this.end.x);
    let y = A * Math.cos(this.start.y) * Math.sin(this.start.x) + B * Math.cos(this.end.y) * Math.sin(this.end.x);
    let z = A * Math.sin(this.start.y) + B * Math.sin(this.end.y);
    let lat = R2D * Math.atan2(z, Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
    let lon = R2D * Math.atan2(y, x);
    return [lon, lat];
};



/*
 * Generate points along the great circle
 */
GreatCircle.prototype.Arc = function(npoints,options) {
    let first_pass = [];
    if (!npoints || npoints <= 2) {
        first_pass.push([this.start.lon, this.start.lat]);
        first_pass.push([this.end.lon, this.end.lat]);
    } else {
        let delta = 1.0 / (npoints - 1);
        for (let i = 0; i < npoints; ++i) {
            let step = delta * i;
            let pair = this.interpolate(step);
            first_pass.push(pair);
        }
    }
    /* partial port of dateline handling from:
      gdal/ogr/ogrgeometryfactory.cpp
      TODO - does not handle all wrapping scenarios yet
    */
    let bHasBigDiff = false;
    let dfMaxSmallDiffLong = 0;
    // from http://www.gdal.org/ogr2ogr.html
    // -datelineoffset:
    // (starting with GDAL 1.10) offset from dateline in degrees (default long. = +/- 10deg, geometries within 170deg to -170deg will be splited)
    let dfDateLineOffset = options && options.offset ? options.offset : 10;
    let dfLeftBorderX = 180 - dfDateLineOffset;
    let dfRightBorderX = -180 + dfDateLineOffset;
    let dfDiffSpace = 360 - dfDateLineOffset;

    // https://github.com/OSGeo/gdal/blob/7bfb9c452a59aac958bff0c8386b891edf8154ca/gdal/ogr/ogrgeometryfactory.cpp#L2342
    for (let j = 1; j < first_pass.length; ++j) {
        let dfPrevX = first_pass[j-1][0];
        let dfX = first_pass[j][0];
        let dfDiffLong = Math.abs(dfX - dfPrevX);
        if (dfDiffLong > dfDiffSpace &&
            ((dfX > dfLeftBorderX && dfPrevX < dfRightBorderX) || (dfPrevX > dfLeftBorderX && dfX < dfRightBorderX))) {
            bHasBigDiff = true;
        } else if (dfDiffLong > dfMaxSmallDiffLong) {
            dfMaxSmallDiffLong = dfDiffLong;
        }
    }

    let poMulti = [];
    if (bHasBigDiff && dfMaxSmallDiffLong < dfDateLineOffset) {
        let poNewLS = [];
        poMulti.push(poNewLS);
        for (let k = 0; k < first_pass.length; ++k) {
            let dfX0 = parseFloat(first_pass[k][0]);
            if (k > 0 &&  Math.abs(dfX0 - first_pass[k-1][0]) > dfDiffSpace) {
                let dfX1 = parseFloat(first_pass[k-1][0]);
                let dfY1 = parseFloat(first_pass[k-1][1]);
                let dfX2 = parseFloat(first_pass[k][0]);
                let dfY2 = parseFloat(first_pass[k][1]);
                if (dfX1 > -180 && dfX1 < dfRightBorderX && dfX2 == 180 &&
                    k+1 < first_pass.length &&
                   first_pass[k-1][0] > -180 && first_pass[k-1][0] < dfRightBorderX)
                {
                     poNewLS.push([-180, first_pass[k][1]]);
                     k++;
                     poNewLS.push([first_pass[k][0], first_pass[k][1]]);
                     continue;
                } else if (dfX1 > dfLeftBorderX && dfX1 < 180 && dfX2 == -180 &&
                     k+1 < first_pass.length &&
                     first_pass[k-1][0] > dfLeftBorderX && first_pass[k-1][0] < 180)
                {
                     poNewLS.push([180, first_pass[k][1]]);
                     k++;
                     poNewLS.push([first_pass[k][0], first_pass[k][1]]);
                     continue;
                }

                if (dfX1 < dfRightBorderX && dfX2 > dfLeftBorderX)
                {
                    // swap dfX1, dfX2
                    let tmpX = dfX1;
                    dfX1 = dfX2;
                    dfX2 = tmpX;
                    // swap dfY1, dfY2
                    let tmpY = dfY1;
                    dfY1 = dfY2;
                    dfY2 = tmpY;
                }
                if (dfX1 > dfLeftBorderX && dfX2 < dfRightBorderX) {
                    dfX2 += 360;
                }

                if (dfX1 <= 180 && dfX2 >= 180 && dfX1 < dfX2)
                {
                    let dfRatio = (180 - dfX1) / (dfX2 - dfX1);
                    let dfY = dfRatio * dfY2 + (1 - dfRatio) * dfY1;
                    poNewLS.push([first_pass[k-1][0] > dfLeftBorderX ? 180 : -180, dfY]);
                    poNewLS = [];
                    poNewLS.push([first_pass[k-1][0] > dfLeftBorderX ? -180 : 180, dfY]);
                    poMulti.push(poNewLS);
                }
                else
                {
                    poNewLS = [];
                    poMulti.push(poNewLS);
                }
                poNewLS.push([dfX0, first_pass[k][1]]);
            } else {
                poNewLS.push([first_pass[k][0], first_pass[k][1]]);
            }
        }
    } else {
        // add normally
        let poNewLS0 = [];
        poMulti.push(poNewLS0);
        for (let l = 0; l < first_pass.length; ++l) {
            poNewLS0.push([first_pass[l][0],first_pass[l][1]]);
        }
    }

    let arc = new Arc(this.properties);
    for (let m = 0; m < poMulti.length; ++m) {
        let line = new LineString();
        arc.geometries.push(line);
        let points = poMulti[m];
        for (let j0 = 0; j0 < points.length; ++j0) {
            line.move_to(points[j0]);
        }
    }
    return arc;
};


export {
    Arc,
    Coord,
    GreatCircle
};

export default {
    Arc,
    Coord,
    GreatCircle
};
