## Getting started

In this guide, you will learn the basics of visualizing data with the Web SDK on top of a world [basemap](https://carto.com/help/glossary/#basemap). There are no previous requirements to complete this guide, but a basic knowledge of HTML, CSS and JavaScript would be helpful.

After completing this guide, you will have your first Web SDK map!

<div class="example-map">
    <iframe
        id="getting-started-final-result"
        src="/developers/web-sdk/examples/maps/guides/getting-started/step-3.html"
        width="100%"
        height="500"
        frameBorder="0">
    </iframe>
</div>

### Basic setup

The most straight-forward way to use the Web SDK is to include the required files from our CDN as seen in the code below. The Web SDK is based on the powerful deck.gl library. In addition to the Web SDK JavaScript file, you need to add:

* deck.gl JavaScript file
* Mapbox GL JavaScript and CSS files

```html
    <!-- Include deck.gl from unpkg CDN -->
    <script src="https://unpkg.com/deck.gl@8.2.0/dist.min.js"></script>

    <!-- Include Mapbox GL from the Mabpox CDN -->
    <script src='https://api.tiles.mapbox.com/mapbox-gl-js/v1.10.0/mapbox-gl.js'></script>
    <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v1.10.0/mapbox-gl.css' rel='stylesheet' />

    <!-- Include Web SDK from the CARTO CDN -->
    <script src="https://libs.cartocdn.com/web-sdk/%VERSION%/index.min.js"></script>
```

**Note:**
**deck.gl and Mapbox GL**: The Web SDK is compatible with specific deck.gl and Mapbox GL versions. We recommend using the same versions that we use in the [examples](/developers/web-sdk/examples/). 

**Note:**
**Developers**: if you have experience with `npm` and a build system (_webpack_, _rollup_...), you can install the Web SDK in your project with `npm install @carto/web-sdk` and import it with `import carto from '@carto/web-sdk'`.


#### Add map container

Next, you need to create a `div` where the map will be drawn:

```html
<div id="map"></div>
```

Style the map `div` and `body` to ensure the map displays at full width:

```css
body {
  margin: 0;
  padding: 0;
}
#map {
  width: 100vw;
  height: 100vh;
}
```

#### Add basemap and set properties

Once you have a `div` for your map, you can use the `carto.viz.createMap` (ToDO Add link to reference) helper. If no parameters are specified, it will create a map with the following defaults:

* Placed within a container with id="map"
* Using CARTO Positron basemap
* Centered on (0,0) coordinates
* Using zoom level 1 (whole world)
 
Please go to the API reference to see the full list of parameters that you can specify.

```js
const deckMap = carto.viz.createMap();
```

At this point you will have a basic map with _Positron_ as the basemap, that opens at zoom level 1 and centered on (0,0):

<div class="example-map">
    <iframe
        id="getting-started-step-1"
        src="/developers/web-sdk/examples/maps/guides/getting-started/step-1.html"
        width="100%"
        height="500"
        style="margin: 20px auto !important"
        frameBorder="0">
    </iframe>
</div>
> View this step [here](/developers/web-sdk/examples/maps/guides/getting-started/step-1.html)

### Define credentials

In order to render data from CARTO you need to have a CARTO account and then get the necessary [credentials](/developers/fundamentals/authorization/).

The first thing you need to do is authenticate the client with [`carto.auth.setDefaultCredentials`](ToDo: add link to API reference), using your own `username` and `apiKey`. For guides and examples, we use the `public` CARTO account so you can try out the library:

```js
carto.auth.setDefaultCredentials({ username: 'public' });
```

### Create map layer

Now you can add a map layer from the public account. In the example below, we are adding a countries layer from [Natural Earth](https://www.naturalearthdata.com/), using the [`carto.viz.Layer`](ToDo: add link to API reference) object.

```js
const countriesLayer = new carto.viz.Layer('ne_50m_admin_0_countries');
```

### Add map layer

Finally you need to use the [`carto.viz.Layer.addTo`](ToDO: add link to API reference) method to add the layer to the map.

```js
countriesLayer.addTo(deckMap);
```
<div class="example-map">
    <iframe
        id="getting-started-step-1"
        src="/developers/web-sdk/examples/maps/guides/getting-started/step-2.html"
        width="100%"
        height="500"
        style="margin: 20px auto !important"
        frameBorder="0">
    </iframe>
</div>
> View this step [here](/developers/web-sdk/examples/maps/guides/getting-started/step-2.html)

### Defining a custom style for the layer

In the previous step we have not specified any styling properties and the layer has been added to the map with a default style. When creating the `Layer` object, we have the option of specifying a `style` parameter. We can take advantage of predefined style helpers to specify the styling properties in a very simple way. In this guide we are going to use the `colorCategories` style helper that accepts a property name and assigns a different color to each value of the property:

```js
const countriesLayer = new carto.viz.Layer('ne_50m_admin_0_countries',
                                           carto.viz.style.colorCategories('continent'));
```

For more information about styling, check out the guide [Using style helpers](/developers/web-sdk/guides/using-style-helpers/).

### All together

<div class="example-map">
    <iframe
        id="getting-started-step-3"
        src="/developers/web-sdk/examples/maps/guides/getting-started/step-3.html"
        width="100%"
        height="500"
        style="margin: 20px auto !important"
        frameBorder="0">
    </iframe>
</div>

> You can explore the final step [here](/developers/web-sdk/examples/maps/guides/getting-started/step-3.html)

```html
<!DOCTYPE html>
<html lang="en">
  <head>

    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Getting Started Guide - Step 3</title>

    <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v1.10.0/mapbox-gl.css' rel='stylesheet' />
  
    <style>
      body {
        margin: 0;
        padding: 0;
      }

      #map {
        width: 100vw;
        height: 100vh;
      }
    </style>

  </head>

  <body>

    <div id="map"></div>

    <!-- Include deck.gl from unpkg CDN -->
    <script src="https://unpkg.com/deck.gl@8.2.0/dist.min.js"></script>

    <!-- Include Mapbox GL from the Mabpox CDN -->
    <script src='https://api.tiles.mapbox.com/mapbox-gl-js/v1.10.0/mapbox-gl.js'></script>

    <!-- Include Web SDK from the CARTO CDN -->
    <script src="https://libs.cartocdn.com/web-sdk/%VERSION%/index.min.js"></script>

    <script>
        carto.auth.setDefaultCredentials({ username: 'public' });
        const deckMap = carto.viz.createMap();
        const countriesLayer = new carto.viz.Layer('ne_50m_admin_0_countries',
                                                   carto.viz.style.colorCategories('continent'));
        countriesLayer.addTo(deckMap);
    </script>
  
  </body>

</html>
```
