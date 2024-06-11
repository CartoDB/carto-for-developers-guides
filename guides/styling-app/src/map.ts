import maplibregl from 'maplibre-gl';
import { Deck } from '@deck.gl/core/typed';
import { fetchMap } from '@deck.gl/carto/typed';

export async function createMap() {

  const {initialViewState, mapStyle, layers} = await fetchMap({ 
    cartoMapId: '48b21cce-d850-4419-a5fb-fcfdccebac6d',
    clientId: 'carto-deck-gl'
  });

  const deck = new Deck({
    canvas: 'deck-canvas',
    controller: true,
    initialViewState, 
    layers,
    getTooltip: ({ object }) =>
      object && {
        html: `
          <strong>Date</strong>: ${object.properties.acq_date}<br/>
          <strong>Brightness TI4</strong>: ${object.properties.bright_ti4}<br/>
          <strong>Fire Radiative Power</strong>: ${object.properties.frp}
        `,
        style: {
          color: '#33333',
          backgroundColor: "#EAEAEA"
        }
      }  
  });

  const basemapStyle = 
    `https://basemaps.cartocdn.com/gl/${mapStyle.styleType}-gl-style/style.json`;

  // Add basemap
  const map = new maplibregl.Map({
    container: 'map', 
    style: basemapStyle, 
    interactive: false
  });
  deck.setProps({
    onViewStateChange: ({viewState}) => {
      const {longitude, latitude, ...rest} = viewState;
      map.jumpTo({center: [longitude, latitude], ...rest});
    }
  });


}
