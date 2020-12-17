## Getting started

In this guide, you will learn the basics of visualizing a CARTO layer with the [Amazon Location](https://aws.amazon.com/location/). There are no previous requirements to complete this guide, but a basic knowledge of web development would be helpful.

After completing this guide, you will have your first Amazon Location map with a CARTO dataset!

<div class="example-map">
    <iframe
        id="getting-started-final-result"
        src="/developers/amazon-location/examples/maps/guides/using-mapbox-gl/step-2.html"
        width="100%"
        height="500"
        frameBorder="0">
    </iframe>
</div>

### Introduction

There are two main steps for visualizing a CARTO layer: first you create a map resource in your AWS account, and then you create a web application that uses a rendering library to visualize the map and the CARTO layer on top of this map.

For this guide, we have already created a map resource called "Rivers" in our AWS account. If you want to create your own map resource, you can follow the instructions from the [Developer Guide](https://docs.aws.amazon.com/location/latest/developerguide/create-map-resource.html).

### Basic setup

The first thing you need to do is to add all the required Amazon (AWS SDK for Javascript and AWS Amplify core) and Mapbox GL dependencies (library and CSS files):

```html
<script src="https://sdk.amazonaws.com/js/aws-sdk-2.775.0.min.js"></script>
<script src="https://unpkg.com/@aws-amplify/core@3.7.0/dist/aws-amplify-core.min.js"></script>
<script src="https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.js"></script>
<link href="https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css" rel="stylesheet" />
```

#### Add map container

Next, you need to create a `div` inside the `body` where the map will be drawn and you need to style them to ensure the map displays at full width:

```html
<body style="margin: 0; padding: 0;">
    <div id="map" style="position: absolute; top: 0; bottom: 0; width: 100%;"></div>
</body>
```

### Setup credentials to access to your map resource

In order to provide access to your map resource, you can use IAM directly or you can use [Amazon Cognito](https://aws.amazon.com/cognito/) authentication if you want to provide access to unauthenticated users or you want to use your own authentication system.

In this guide, we want our map to be accessible to unauthenticated users, so we are using Amazon Cognito. We have created an identity pool that allows access to unauthenticated entities. We have also added a policy to grant read-only access to our map resource.

Now, in the application code, we instantiate a credential provider using Cognito:

```js
const identityPoolId = "us-east-2:303d12f6-e24e-4571-8a79-66cc7c6a6bdc"; // Cognito Identity Pool ID
const credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: identityPoolId,
});
```

### Initialize the map

Before instantiating the Mapbox GL JS map we need to obtain the credentials from the Cognito identity provider. This is an asynchronous operation, so we need to wait for the credentials. After we have obtained the credentials, we create our `Map` object assigning the style property to our Amazon Location Service map name. We also need to define the `transformRequest` handler to sign our requests to AWS.

```js
async function initializeMap() {
  await credentials.getPromise();

  const mapName = "Rivers";

  // actually initialize the map
  map = new mapboxgl.Map({
    container: "map",
    center: [20, 49], 
    zoom: 4, 
    style: mapName,
    transformRequest,
  });

  map.addControl(new mapboxgl.NavigationControl(), "top-left");
}
```

### Sign the requests to AWS

We need to sign the requests from Mapbox GL JS to our map resource using the credentials. In order to do that, we take advantage of the [`transformRequest`](https://docs.mapbox.com/mapbox-gl-js/api/properties/#requestparameters) option to intercept the requests and modify them before they are sent.

```js
AWS.config.region = identityPoolId.split(":")[0];

const { Signer } = window.aws_amplify_core;

function transformRequest(url, resourceType) {
  if (resourceType === "Style" && !url.includes("://")) {
    url = `https://maps.geo.${AWS.config.region}.amazonaws.com/maps/v0/maps/${url}/style-descriptor`;
  }
  if (url.includes("amazonaws.com")) {
    return {
      url: Signer.signUrl(url, {
        access_key: credentials.accessKeyId,
        secret_key: credentials.secretAccessKey,
        session_token: credentials.sessionToken,
      }),
    };
  }
  return { url };
}
```

#### Initialize map

Now we just need to call the function to initialize our map:

```js
initializeMap();
```

At this point you will have a basic map with the Rivers Amazon Location map resource:

<div class="example-map">
    <iframe
        id="using-mapbox-gl-step-1"
        src="/developers/amazon-location/examples/maps/guides/using-mapbox-gl/step-1.html"
        width="100%"
        height="500"
        style="margin: 20px auto !important"
        frameBorder="0">
    </iframe>
</div>
> View this step [here](/developers/amazon-location/examples/maps/guides/using-mapbox-gl/step-1.html)

### Add CARTO layer

In order to visualize the CARTO tileset, we are going to take advantage of the new TileJSON endpoints in the Maps API v2. We just need to provide the endpoint URL through the [`source.url`](https://docs.mapbox.com/mapbox-gl-js/style-spec/sources/) property while calling the [`addLayer`](https://docs.mapbox.com/mapbox-gl-js/api/map/#map#addlayer) method on the map.

We are using a public tileset generated using our BigQuery Tiler and we are assigning a different color to each line representing a river, depending on the value of the `bearing` attribute.

```js
map.addLayer(
  {
    id: 'rivers_carto',
    type: 'line',
    source: {
      type: 'vector',
      url: 'https://maps-api-v2.us.carto.com/user/public/tilejson/tileset/bigquery/cartobq.maps.eurivers?api_key=default_public&client=amazon-location'
    },
    'source-layer': 'default',
    "paint": {
      "line-color": {
        "property": "bearing",
        "type": "interval",
        "stops": [
          [{"zoom": 0, "value": 0}, "rgba(255, 0, 128, 1)"],
          [{"zoom": 0, "value": 18}, "rgba(212, 7, 146, 1)"],
          [{"zoom": 0, "value": 37}, "rgba(212, 7, 146, 1)"],
          [{"zoom": 0, "value": 56}, "rgba(170, 13, 164, 1)"],
          [{"zoom": 0, "value": 75}, "rgba(128, 20, 181, 1)"],
          [{"zoom": 0, "value": 94}, "rgba(85, 26, 199, 1)"],
          [{"zoom": 0, "value": 113}, "rgba(43, 33, 217, 1)"],
          [{"zoom": 0, "value": 132}, "rgba(0, 39, 235, 1)"],
          [{"zoom": 0, "value": 151}, "rgba(3, 72, 217, 1)"],
          [{"zoom": 0, "value": 170}, "rgba(43, 33, 217, 1)"],
          [{"zoom": 0, "value": 189}, "rgba(9, 138, 181, 1)"],
          [{"zoom": 0, "value": 208}, "rgba(12, 170, 164, 1)"],
          [{"zoom": 0, "value": 227}, "rgba(15, 203, 146, 1)"],
          [{"zoom": 0, "value": 246}, "rgba(18, 236, 128, 1)"],
          [{"zoom": 0, "value": 265}, "rgba(58, 197, 128, 1)"],
          [{"zoom": 0, "value": 284}, "rgba(97, 157, 128, 1)"],
          [{"zoom": 0, "value": 303}, "rgba(136, 118, 128, 1)"],
          [{"zoom": 0, "value": 322}, "rgba(176, 79, 128, 1)"],
          [{"zoom": 0, "value": 341}, "rgba(215, 39, 128, 1)"],
          [{"zoom": 0, "value": 360}, "rgba(255, 0, 128, 1)"]
        ]
      }
    }
  }
);
```

### All together

Finally we need to add the layer to the map after it is loaded:

```js
async function initializeMap() {
  ...
  map.on('load', () => {
    addCartoLayer();
  })
}
```

<div class="example-map">
    <iframe
        id="getting-started-step-2"
        src="/developers/amazon-location/examples/maps/guides/using-mapbox-gl/step-2.html"
        width="100%"
        height="500"
        style="margin: 20px auto !important"
        frameBorder="0">
    </iframe>
</div>

> You can explore the final step [here](/developers/amazon-location/examples/maps/guides/using-mapbox-gl/step-2.html)

```html
<!DOCTYPE html>
<html>
  
  <head>
    <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
    <script src="https://sdk.amazonaws.com/js/aws-sdk-2.775.0.min.js"></script>
    <script src="https://unpkg.com/@aws-amplify/core@3.7.0/dist/aws-amplify-core.min.js"></script>
    <script src="https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.js"></script>
    <link href="https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css" rel="stylesheet" />
  </head>

  <body style="margin: 0; padding: 0;">
    <div id="map" style="position: absolute; top: 0; bottom: 0; width: 100%;"></div>
  </body>
  
  <script>

    let map;

    // instantiate a Cognito-backed credential provider
    const identityPoolId = "us-east-2:303d12f6-e24e-4571-8a79-66cc7c6a6bdc"; // Cognito Identity Pool ID
    const credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: identityPoolId,
    });

    /**
     * Sign requests made by Mapbox GL using AWS SigV4.
     */
    AWS.config.region = identityPoolId.split(":")[0];
    const { Signer } = window.aws_amplify_core;
    function transformRequest(url, resourceType) {
      if (resourceType === "Style" && !url.includes("://")) {
        // resolve to an AWS URL
        url = `https://maps.geo.${AWS.config.region}.amazonaws.com/maps/v0/maps/${url}/style-descriptor`;
      }

      if (url.includes("amazonaws.com")) {
        // only sign AWS requests (with the signature as part of the query string)
        return {
          url: Signer.signUrl(url, {
            access_key: credentials.accessKeyId,
            secret_key: credentials.secretAccessKey,
            session_token: credentials.sessionToken,
          }),
        };
      }

      // don't sign
      return { url };
    }

    /**
     * Initialize a map.
     */
    async function initializeMap() {

      // load credentials and set them up to refresh
      await credentials.getPromise();

      const mapName = "Rivers"; // Amazon Location Service Map Name

      map = new mapboxgl.Map({
        container: "map",
        center: [20, 49], 
        zoom: 4, 
        style: mapName,
        transformRequest,
      });

      map.addControl(new mapboxgl.NavigationControl(), "top-left");

      map.on('load', () => {
        addCartoLayer();
      })
    }

    async function addCartoLayer() {
      map.addLayer(
        {
          id: 'rivers_carto',
          type: 'line',
          source: {
            type: 'vector',
            url: 'https://maps-api-v2.us.carto.com/user/public/tilejson/tileset/bigquery/cartobq.maps.eurivers?api_key=default_public&client=amazon-location'

          },
          'source-layer': 'default',
          "paint": {
            "line-color": {
              "property": "bearing",
              "type": "interval",
              "stops": [
                [{"zoom": 0, "value": 0}, "rgba(255, 0, 128, 1)"],
                [{"zoom": 0, "value": 18}, "rgba(212, 7, 146, 1)"],
                [{"zoom": 0, "value": 37}, "rgba(212, 7, 146, 1)"],
                [{"zoom": 0, "value": 56}, "rgba(170, 13, 164, 1)"],
                [{"zoom": 0, "value": 75}, "rgba(128, 20, 181, 1)"],
                [{"zoom": 0, "value": 94}, "rgba(85, 26, 199, 1)"],
                [{"zoom": 0, "value": 113}, "rgba(43, 33, 217, 1)"],
                [{"zoom": 0, "value": 132}, "rgba(0, 39, 235, 1)"],
                [{"zoom": 0, "value": 151}, "rgba(3, 72, 217, 1)"],
                [{"zoom": 0, "value": 170}, "rgba(43, 33, 217, 1)"],
                [{"zoom": 0, "value": 189}, "rgba(9, 138, 181, 1)"],
                [{"zoom": 0, "value": 208}, "rgba(12, 170, 164, 1)"],
                [{"zoom": 0, "value": 227}, "rgba(15, 203, 146, 1)"],
                [{"zoom": 0, "value": 246}, "rgba(18, 236, 128, 1)"],
                [{"zoom": 0, "value": 265}, "rgba(58, 197, 128, 1)"],
                [{"zoom": 0, "value": 284}, "rgba(97, 157, 128, 1)"],
                [{"zoom": 0, "value": 303}, "rgba(136, 118, 128, 1)"],
                [{"zoom": 0, "value": 322}, "rgba(176, 79, 128, 1)"],
                [{"zoom": 0, "value": 341}, "rgba(215, 39, 128, 1)"],
                [{"zoom": 0, "value": 360}, "rgba(255, 0, 128, 1)"]
              ]
            }
          }
        }
      );
    }

    initializeMap();

  </script>

</html>
```
