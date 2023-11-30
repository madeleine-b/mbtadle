import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

import { todaysTripInLines, todaysSolution } from '../utils/answerValidations';

import stations from "../data/stations.json";
import routes from "../data/routes.json";
import shapes from "../data/shapes.json";

import './MapFrame.scss';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;


const MANHATTAN_TILT = 29;

const MapFrame = (props) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-71.105505);
  const [lat, setLat] = useState(42.362561);

  const [zoom, setZoom] = useState(12);
  const solution = todaysSolution();

  const stopsGeoJson = () => {
    const stops = [
      solution.origin,
      solution.first_transfer_arrival,
      solution.first_transfer_departure,
      solution.second_transfer_arrival,
      solution.second_transfer_departure,
      solution.destination
    ];
    return {
      "type": "FeatureCollection",
      "features": [...new Set(stops)].map((stopId) => {
        const station = stations[stopId];
        return {
          "type": "Feature",
          "properties": {
            "id": stopId,
            "name": station.name,
          },
          "geometry": {
            "type": "Point",
            "coordinates": [station.longitude, station.latitude]
          }
        }
      })
    };
  }

  const lineGeoJson = (line) => {
    const route = routes[line.route];
    let shape;
    const beginCoord = [stations[line.begin].latitude, stations[line.begin].longitude];
    const endCoord = [stations[line.end].latitude, stations[line.end].longitude];
    let coordinates = [];

    shape = shapes[line.route];

    const beginIndex = shape.findIndex((coord) => coord[0] === beginCoord[0] && coord[1] === beginCoord[1]);
    const endIndex = shape.findIndex((coord) => coord[0] === endCoord[0] && coord[1] === endCoord[1]);

    if (beginIndex < endIndex) {
      coordinates = shape.slice(beginIndex, endIndex + 1);
    } else {
      coordinates = shape.slice(endIndex, beginIndex + 1);
    }

    return {
      "type": "Feature",
      "properties": {
        "color": route.color,
      },
      "geometry": {
        "type": "LineString",
        "coordinates": coordinates.map((i) => [i[1], i[0]])
      }
    }
  }

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mbarowsky/clpkrvi5d00fn01qj0h4b1416?optimize=true',
      center: [lng, lat],
      bearing: MANHATTAN_TILT,
      minZoom: 9,
      zoom: zoom,
      maxBounds: [
        [-71.559417, 42.070747],
        [-70.802049, 42.515720]
      ],
      maxPitch: 0,
    });
    map.current.dragRotate.disable();
    map.current.touchZoomRotate.disableRotation();

    map.current.on('load', () => {
      map.current.resize();
      const trip = todaysTripInLines();
      let coordinates = [];
      [
        {
          route: trip[0],
          begin: solution.origin,
          end: solution.first_transfer_arrival,
        },
        {
          route: trip[1],
          begin: solution.first_transfer_departure,
          end: solution.second_transfer_arrival,
        },
        {
          route: trip[2],
          begin: solution.second_transfer_departure,
          end: solution.destination,
        },
      ].forEach((line, i) => {
        const lineJson = lineGeoJson(line);
        coordinates = coordinates.concat(lineJson.geometry.coordinates);
        const layerId = `line-${i}`;
        map.current.addSource(layerId, {
          "type": "geojson",
          "data": lineJson
        });
        map.current.addLayer({
          "id": layerId,
          "type": "line",
          "source": layerId,
          "layout": {
            "line-join": "miter",
            "line-cap": "round",
          },
          "paint": {
            "line-width": 2,
            "line-color": ["get", "color"],
          }
        });
      });
      const stopsJson = stopsGeoJson();
      map.current.addSource("Stops", {
        "type": "geojson",
        "data": stopsJson
      });
      map.current.addLayer({
        "id": "Stops",
        "type": "symbol",
        "source": "Stops",
        "layout": {
          "text-field": ['get', 'name'],
          "text-size": 12,
          "text-font": ['Lato Bold', "Open Sans Bold","Arial Unicode MS Bold"],
          "text-optional": false,
          "text-justify": "auto",
          'text-allow-overlap': false,
          "text-padding": 1,
          "text-variable-anchor": ["bottom-right", "top-right", "bottom-left", "top-left", "right", "left", "bottom"],
          "text-radial-offset": 0.5,
          "icon-image": "express-stop",
          "icon-size": 8/13,
          "icon-allow-overlap": true,
        },
        "paint": {
          "text-color": '#ffffff',
        },
      });
      const bounds = coordinates.reduce((bounds, coord) => {
        return bounds.extend(coord);
      }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

     /* if (!bounds.isEmpty()) {
        map.current.fitBounds(bounds, {
          padding: {
            top: 20,
            right: 20,
            left: 20,
            bottom: 150,
          },
          bearing: MANHATTAN_TILT,
        });
      }*/
    });


  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  return (
    <div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

export default MapFrame; 
