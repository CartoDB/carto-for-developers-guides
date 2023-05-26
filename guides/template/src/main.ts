import './style.css'
import 'maplibre-gl/dist/maplibre-gl.css';
import { createMap } from './map'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div id="map"></div>
  <canvas id="deck-canvas"></canvas>
`
createMap()