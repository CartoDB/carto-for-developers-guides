// const CANVAS_STYLE = {
//   position: 'absolute',
//   left: 0,
//   top: 0,
//   width: '100%',
//   height: '100%'
// }

// const TOOLTIP_STYLE = {
//   color: '#fff',
//   opacity: '0.9',
//   borderRadius: '0.25rem',
//   textTransform: 'capitalize',
//   fontFamily: 'Montserrat, "Open Sans", sans-serif',
//   fontSize: '0.7rem'         
// };

// function getTooltip(pickingInfo) {
//   if (pickingInfo.object) {
//     let html = `<div style="font-size: 0.9rem;"><strong>${pickingInfo.layer.id}</strong></div>`;

//     for (const [name, value] of Object.entries(pickingInfo.object.properties)) {
//       if (name !== 'layerName' && name !== 'cartodb_id') {
//         html += `<div><strong>${name}: </strong>${value}</div>`;
//       }
//     }
    
//     return {
//       html,
//       style: TOOLTIP_STYLE
//     }
//   }

//   return null;
// }

const DEFAULT_MAP_PROPS = {
  center: { lat: 38, lng: -98 },
  zoom: 4,
  mapId: '856f688f677c0bc3',
  fullscreenControl: false,
  streetViewControl: false,
  // zoomControlOptions: {
  //   position: google.maps.ControlPosition.LEFT_BOTTOM,
  // }
  // layers: [],
  // basemap: null,
  // controller: true,
  // useDevicePixels: 2,
  // getCursor: ({ isDragging, isHovering }) => (isDragging ? 'grabbing' : isHovering ? 'pointer' : ''),
  // getTooltip,
  // layerFilter ({ layer, viewport }) {
  //   const filterFn = layer.props.layerFilter
  //   if (typeof filterFn === 'function') {
  //     return filterFn(viewport, layer)
  //   }
  //   return true
  // }
}

const API_KEY = 'ENTER_HERE_YOUR_GOOGLE_MAPS_API_KEY';
const CALLBACK_NAME = 'gmapsCallback';

let initialized = !!window.google;
let resolveInitPromise;
let rejectInitPromise;
// This promise handles the initialization
// status of the google maps script.
const initPromise = new Promise((resolve, reject) => {
  resolveInitPromise = resolve;
  rejectInitPromise = reject;
});

function init() {
  // If Google Maps already is initialized
  // the `initPromise` should get resolved
  // eventually.
  if (initialized) return initPromise;

  initialized = true;
  // The callback function is called by
  // the Google Maps script if it is
  // successfully loaded.
  window[CALLBACK_NAME] = () => resolveInitPromise(window.google);

  // We inject a new script tag into
  // the `<head>` of our HTML to load
  // the Google Maps script.
  const script = document.createElement('script');
  script.async = true;
  script.defer = true;
  script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=${CALLBACK_NAME}`;
  script.onerror = rejectInitPromise;
  document.querySelector('head').appendChild(script);

  return initPromise;
}


/**
 * @params container (Element) - DOM element to add deck.gl canvas to
 * @params map (Object) - map API. Set to falsy to disable
 */
export default class GoogleMap {
  constructor (props = {}) {
    this._props = {
      ...DEFAULT_MAP_PROPS,
      ...props
    }
  }

  async initialize() {
    const google = await init();
    this._map = new google.maps.Map(document.getElementById('map'), this._props);

    // const viewState = props.viewState || props.initialViewState
    // const basemap = props.basemap

    // super({ canvas: deckCanvas, ...props })

    // if (basemap) {
    //   this._map = basemap
    // } else {
    //   this._map = new mapboxgl.Map({
    //     container: mapboxCanvas,
    //     style: props.mapStyle,
    //     interactive: false,
    //     center: [viewState.longitude, viewState.latitude],
    //     zoom: viewState.zoom,
    //     bearing: viewState.bearing || 0,
    //     pitch: viewState.pitch || 0
    //   })
    // }
  }

  getGoogleMap () {
    return this._map
  }

  finalize () {
    if (this._map) {
      this._map.remove()
    }
    super.finalize()
  }
}
