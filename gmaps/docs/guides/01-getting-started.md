## Getting started

In this guide, you will learn the basics of visualizing a CARTO dataset with the [Google Maps Javascript API](https://developers.google.com/maps/documentation/javascript/overview). There are no previous requirements to complete this guide, but a basic knowledge of Google Maps Javascript API would be helpful.

After completing this guide, you will have your first Google Maps API map with a CARTO dataset!

<div class="example-map">
    <iframe
        id="getting-started-final-result"
        src="/developers/gmaps/examples/maps/guides/getting-started/step-2.html"
        width="100%"
        height="500"
        frameBorder="0">
    </iframe>
</div>

### Basic setup

The first thing you need to do is to add all the required dependencies:

- [Google Maps Javascript API](https://developers.google.com/maps/documentation/javascript/overview) (the API key below is only valid for carto.com so you will need to provide your own API key)
- [Polyfill.io](https://polyfill.io) 
- [deck.gl](https://deck.gl), including CARTO [submodule](https://deck.gl/docs/api-reference/carto/overview)

```html
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDvHtBZM79O5uGTBT1ZOWOKW2_FVMstHNs&libraries=visualization&v=weekly"></script>
<script src="https://polyfill.io/v3/polyfill.min.js?features=default"></script>
<script src="https://unpkg.com/deck.gl@^8.3.0/dist.min.js"></script>
<script src="https://unpkg.com/@deck.gl/carto@^8.3.0/dist.min.js"></script>
```

#### Add map container

Next, you need to create a `div` inside the `body` where the map will be drawn and you need to style them to ensure the map displays at full width:

```html
<body style="margin: 0; padding: 0;">
    <div id="map" style="width: 100vw; height: 100vh;"></div>
</body>
```

#### Create map and set properties

Once you have a `div` for your map, you can use the `google.maps.Map` constructor to create your map with the desired initial view:

```js
const map = new google.maps.Map(document.getElementById("map"), {
    center: {
        lat: 0,
        lng: 0,
    },
    zoom: 2,
});
```

At this point you will have a basic map:

<div class="example-map">
    <iframe
        id="getting-started-step-1"
        src="/developers/gmaps/examples/maps/guides/getting-started/step-1.html"
        width="100%"
        height="500"
        style="margin: 20px auto !important"
        frameBorder="0">
    </iframe>
</div>
> View this step [here](/developers/gmaps/examples/maps/guides/getting-started/step-1.html)

### Define credentials

In order to render data from CARTO you need to have a CARTO account and then get the necessary [credentials](/developers/fundamentals/authorization/).

The first thing you need to do is authenticate the client with the `deck.carto.setDefaultCredentials` function, using your own `username` and `apiKey`. For guides and examples, we use the `public` CARTO account so you can try out the library:

```js
deck.carto.setDefaultCredentials({
    username: "public",
    apiKey: "default_public",
});
```

### Create map layer

Now you can add a map layer from the public account. In order to add the layer, we will use the [`GoogleMapsOverlay`](https://deck.gl/docs/api-reference/google-maps/google-maps-overlay) class from deck.gl. We need to specify the layers as an array. In this case, we only have one [`CartoSQLLayer`](https://deck.gl/docs/api-reference/carto/carto-sql-layer) from the deck.gl CARTO submodule. We pass three parameters to the constructor:

- `data` contains the dataset that we want to visualize. It can be the name of a dataset or a SQL query. For best performance, we recommend to use always a SQL query retrieving only the fields we need in the client. Otherwise we could be generating very large tiles that will degrade the performance.

- Style parameters. In order to display the information the [`CartoSQLLayer`](https://deck.gl/docs/api-reference/carto/carto-sql-layer) uses the deck.gl [`MVTLayer`](https://deck.gl/docs/api-reference/geo-layers/mvt-layer) that takes advantage of [`GeoJsonLayer`](https://deck.gl/docs/api-reference/layers/geojson-layer) to style the features, so all the properties of this class are supported. The style parameters depend on the dataset type of geometry. In this case, we are adding a point layer, so we specify the point color using the `getFillColor` property and the point size through the `pointRadiusMinPixels` property.
   
```js
const deckOverlay = new deck.GoogleMapsOverlay({
    layers: [
        new deck.carto.CartoSQLLayer({
            data: `SELECT the_geom_webmercator, name FROM populated_places`,
            getFillColor: [238, 77, 90],
            pointRadiusMinPixels: 2.5
        }),
    ]
});
```

### Add map layer

Finally you need to use the [`setMap`] function on the [`GoogleMapsOverlay`](https://deck.gl/docs/api-reference/google-maps/google-maps-overlay) object to add the layer to the map.

```js
deckOverlay.setMap(map);
```

### All together

<div class="example-map">
    <iframe
        id="getting-started-step-2"
        src="/developers/gmaps/examples/maps/guides/getting-started/step-2.html"
        width="100%"
        height="500"
        style="margin: 20px auto !important"
        frameBorder="0">
    </iframe>
</div>

> You can explore the final step [here](/developers/gmaps/examples/maps/guides/getting-started/step-2.html)

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDvHtBZM79O5uGTBT1ZOWOKW2_FVMstHNs&libraries=visualization&v=weekly"></script>
    <script src="https://polyfill.io/v3/polyfill.min.js?features=default"></script>
    <script src="https://unpkg.com/deck.gl@^8.3.0/dist.min.js"></script>
    <script src="https://unpkg.com/@deck.gl/carto@latest/dist.min.js"></script>
  </head>

  <body style="margin: 0; padding: 0;">
    <div id="map" style="width: 100vw; height: 100vh;"></div>
  </body>

  <script type="text/javascript">

    const map = new google.maps.Map(document.getElementById("map"), {
      center: {
        lat: 0,
        lng: 0,
      },
      zoom: 2,
    });
    
    deck.carto.setDefaultCredentials({
      username: "public",
      apiKey: "default_public",
    });

    const deckOverlay = new deck.GoogleMapsOverlay({
      layers: [
        new deck.carto.CartoSQLLayer({
          data: `SELECT * FROM populated_places`,
          getLineColor: [255, 255, 255],
          getFillColor: [238, 77, 90],
          pointRadiusMinPixels: 6,
          lineWidthMinPixels: 1,
        }),
      ],
    });

    deckOverlay.setMap(map);

  </script>
</html>
```
