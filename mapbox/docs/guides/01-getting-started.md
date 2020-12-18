## Getting started

In this guide, you will learn the basics of visualizing a CARTO dataset with the [Mapbox GL JS library](https://docs.mapbox.com/mapbox-gl-js/api/). There are no previous requirements to complete this guide, but a basic knowledge of the Mapbox GL JS library would be helpful.

After completing this guide, you will have your first Mapbox GL map with a CARTO dataset!

<div class="example-map">
    <iframe
        id="getting-started-final-result"
        src="/developers/mapbox/examples/maps/guides/getting-started/step-2.html"
        width="100%"
        height="500"
        frameBorder="0">
    </iframe>
</div>


### About MapboxGL license

Beginning with **v2.0.0**, `mapbox-gl-js` is no longer under the 3-Clause BSD license. Also, from that same version, a billable map load occurs whenever a Map object is initialized. That leaves **1.13.0** as the latest mapbox-gl-js version with BSD, that can be freely used.

Thus, in the current example we are using 1.13.0 assets, hosted at CARTO CDN, so no billing is applied if you replicate it as it is. For sure, you can replace those assets and use mapbox-gl >=v2 from their CDN, but in that case you would need to use a valid Mapbox access token and to ensure you know the new billing model and license.

For more info about this, you can read our blogpost [Our Thoughts as MapboxGL JS v2.0 Goes Proprietary](https://carto.com/blog/our-thoughts-as-mapboxgl-js-2-goes-proprietary/).

### Basic setup

The first thing you need to do is to add all the required Mapbox GL dependencies (library and CSS files):

```html
  <script src="https://libs.cartocdn.com/mapbox-gl/v1.13.0/mapbox-gl.js"></script>
  <link href="https://libs.cartocdn.com/mapbox-gl/v1.13.0/mapbox-gl.css" rel="stylesheet" />
```

#### Add map container

Next, you need to create a `div` inside the `body` where the map will be drawn and you need to style them to ensure the map displays at full width:

```html
<body style="margin: 0; padding: 0;">
    <div id="map" style="position: absolute; top: 0; bottom: 0; width: 100%;"></div>
</body>
```

#### Create map and set properties

Once you have a `div` for your map, you can use the [`mapboxgl.Map`](https://docs.mapbox.com/mapbox-gl-js/api/map/) constructor to create your map with the desired initial view. Here we are also specifying the style property to use one of the CARTO basemaps. If you want to use a Mapbox basemap, you will need to provide your Mapbox access token:

```js
const map = new mapboxgl.Map({
    container: 'map',
    style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
    center: [0, 0],
    zoom: 1
});
```

At this point you will have a basic map with the Voyager CARTO basemap:

<div class="example-map">
    <iframe
        id="getting-started-step-1"
        src="/developers/mapbox/examples/maps/guides/getting-started/step-1.html"
        width="100%"
        height="500"
        style="margin: 20px auto !important"
        frameBorder="0">
    </iframe>
</div>
> View this step [here](/developers/mapbox/examples/maps/guides/getting-started/step-1.html)

### Add layer

In order to visualize a CARTO dataset, we need to provide vector tiles source URLs through the [`source.tiles`](https://docs.mapbox.com/mapbox-gl-js/style-spec/sources/) property while calling the [`addLayer`](https://docs.mapbox.com/mapbox-gl-js/api/map/#map#addlayer) method on the map. We also need to indicate the ID for the layer and the styling properties:

```js
map.addLayer(
    {
    id: 'populated_places',
    type: 'circle',
    source: {
        type: 'vector',
        tiles: tileSourceURLs
    },
    'source-layer': 'layer0',
    paint: {
        'circle-color': '#EE4D5A',
        'circle-stroke-color': '#FFF',
        'circle-stroke-width': 1
    }
    }
);
```

The tiles source URLs need to be retrieved using the [Maps API](https://carto.com/developers/maps-api/). You can go to the docs if you want to know more about the possibilities of the Maps API but, for this example, we will focus on the basic functionality.

#### MapConfig

When we want to use the Maps API, we first need to do a process called instantiating the map. This instantiation requires to send a payload called a [MapConfig](https://carto.com/developers/maps-api/guides/MapConfig-file-format/) where we specify the SQL statement to retrieve the information for the dataset we want to visualize and additional options like the map type or the tile extent size. 

```js
const mapConfig = JSON.stringify({
    version: '1.3.1',
    buffersize: {mvt: 1},
    layers: [
        {
            type: 'mapnik',
            options: {
                sql: 'SELECT the_geom_webmercator, name FROM populated_places',
                vector_extent: 4096,
                bufferSize: 1,
                version: '1.3.1'
            }
        }
    ]
});
```

In order to have the better performance, we recommend you to retrieve only the fields you want to use client-side, instead of selecting all the fields (SELECT *). If you select all the fields from the dataset, the vector tiles will be bigger than needed and would take more time to encode, download and decode.

#### Maps API Endpoint

This MapConfig must be sent to the Maps API endpoint. This endpoint has the following template:

https://{username}.carto.com/api/v1/map/?api_key={api_key}

In order to render data from CARTO you need to have a CARTO account and then get the necessary [credentials](/developers/fundamentals/authorization/). The credentials consists of a username and a corresponding API key. The API key determines what datasets can access the Maps API, so you need to create an API key with permissions to the dataset you want to visualize. For guides and examples, we use the `public` CARTO account so you can try out the library:

https://public.carto.com/api/v1/map/?api_key=default_public


#### Instantiating the map

Now that we have our endpoint and our MapConfig, we can call the Maps API to get the tile sources URLs. We can use the `fetch` function with a Request object to retrieve the information asynchronously. We are instantiating an [anonymous map](https://carto.com/developers/maps-api/guides/anonymous-maps/) and the response contains, among other information, a metadata object about the layers requested in the MapConfig. This metadata object contains a `tilejson` property with information about the tile sources URLs:

```js
const response = await fetch(request);
tileSourceURLs = (await response.json()).metadata.tilejson.vector.tiles
```

MapConfig objects can be quite large and, depending on the browser and the web server, we might hit a limit with the URL length. We recommend you to always use a GET request if possible, but if you are getting URL length errors, you should change to POST requests. In the complete example, we are checking the length against a 2048 character limit but this could be different depending on the browsers you want to support.

### All together

<div class="example-map">
    <iframe
        id="getting-started-step-2"
        src="/developers/mapbox/examples/maps/guides/getting-started/step-2.html"
        width="100%"
        height="500"
        style="margin: 20px auto !important"
        frameBorder="0">
    </iframe>
</div>

> You can explore the final step [here](/developers/mapbox/examples/maps/guides/getting-started/step-2.html)

```html
<!DOCTYPE html>
<html>
  
  <head>
    <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
    <script src="https://libs.cartocdn.com/mapbox-gl/v1.13.0/mapbox-gl.js"></script>
    <link href="https://libs.cartocdn.com/mapbox-gl/v1.13.0/mapbox-gl.css" rel="stylesheet" />
  </head>

  <body style="margin: 0; padding: 0;">
    <div id="map" style="position: absolute; top: 0; bottom: 0; width: 100%;"></div>
  </body>
  
  <script>

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
      center: [0, 0],
      zoom: 1
    });

    const REQUEST_GET_MAX_URL_LENGTH = 2048;

    addCartoLayer();

    async function addCartoLayer() {
      const tileSourceURLs = await getTileSources();
      map.addLayer(
        {
          id: 'populated_places',
          type: 'circle',
          source: {
            type: 'vector',
            tiles: tileSourceURLs
          },
          'source-layer': 'layer0',
          paint: {
            'circle-color': '#EE4D5A',
            'circle-stroke-color': '#FFF',
            'circle-stroke-width': 1
          }
        }
      );
    }

    async function getTileSources() {
      const mapConfig = JSON.stringify({
        version: '1.3.1',
        buffersize: {mvt: 1},
        layers: [
          {
            type: 'mapnik',
            options: {
              sql: 'SELECT the_geom_webmercator, name FROM populated_places',
              vector_extent: 4096,
              bufferSize: 1,
              version: '1.3.1'
            }
          }
        ]
      });
      const url = `https://public.carto.com/api/v1/map?apikey=default_public}`;
      const getUrl = `${url}&config=${encodeURIComponent(mapConfig)}`;
      let request;

      if (getUrl.length < REQUEST_GET_MAX_URL_LENGTH) {
        request = new Request(getUrl, {
          method: 'GET',
          headers: {
            Accept: 'application/json'
          }
        });

      } else {
        request = new Request(url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: mapConfig
        });
      }

      const response = await fetch(request);
      return (await response.json()).metadata.tilejson.vector.tiles
    }

  </script>

</html>
```
