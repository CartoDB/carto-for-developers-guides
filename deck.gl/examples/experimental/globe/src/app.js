import {Deck, _GlobeView as GlobeView} from '@deck.gl/core';
import {SolidPolygonLayer, GeoJsonLayer, ArcLayer} from '@deck.gl/layers';

const INITIAL_VIEW_STATE = {
  latitude: 40.783058,
  longitude: -73.971252,
  zoom: 0
};

export const deck = new Deck({
  views: new GlobeView(),
  initialViewState: INITIAL_VIEW_STATE,
  controller: true,
  layers: []
});

load()

async function load(){
  const countries = await fetch('https://aasuero.carto.com/api/v2/sql?q=SELECT%20*%20FROM%20world_borders&format=geojson');
  const countriesJSON = await countries.json();

  const airports = await fetch('https://public.carto.com/api/v2/sql?q=select * from ne_10m_airports where scalerank < 4 &format=geojson');
  const airportsJSON = await airports.json();

  const layers = [
    // A GeoJSON polygon that covers the entire earth
    // See /docs/api-reference/globe-view.md#remarks
    new SolidPolygonLayer({
      id: 'background',
      data: [
        // prettier-ignore
        [[-180, 90], [0, 90], [180, 90], [180, -90], [0, -90], [-180, -90]]
      ],
      opacity: 0.5,
      getPolygon: d => d,
      stroked: false,
      filled: true,
      getFillColor: [5, 10, 40]
    }),
    new GeoJsonLayer({
      id: 'base-map',
      data: countriesJSON,
      // Styles
      stroked: true,
      filled: true,
      lineWidthMinPixels: 2,
      getLineColor: [5, 10, 40],
      getFillColor: [15, 40, 80]
    }),
    new ArcLayer({
      id: 'arcs',
      data: airportsJSON.features,

      // Styles
      getSourcePosition: f => [-0.4531566, 51.4709959], // London
      getTargetPosition: f => {
        return f.geometry.coordinates;
      },
      getSourceColor: [0, 128, 200],
      getTargetColor: [200, 0, 80],
      getWidth: 1
    })
  ]

  deck.setProps({ layers });

}

// For automated test cases
/* global document */
document.body.style.margin = '0px';
document.body.style.background = '#111';
