## Getting started

Deck.gl is the preferred library for building web applications with CARTO. We recommend you to use deck.gl if you want to create custom apps faster and better using our APIs. Starting with version 8.3, deck.gl includes a submodule @deck.gl/carto for working with CARTO datasets and tilesets in a very easy and straightforward way. With deck.gl you can choose between different basemaps for your visualizations. CARTO provides a set of free basemaps from OpenStreetMap, but you can also use Google Maps, Mapbox or any other provider with MVT support.

In this guide, you will learn how to install CARTO for deck.gl in your computer and how to run the React and pure JS examples.

### Installation

You can work with CARTO for deck.gl with the NPM module for React or Pure JS applications:

```console
npm install deck.gl
```   

Or you can use the scripting API:

```html
<script src="https://unpkg.com/deck.gl@latest/dist.min.js"></script>
<script src="https://unpkg.com/@deck.gl/carto@latest/dist.min.js"></script>
```   

### Running the React and pure JS examples

In the [Examples]({{site.baseurl}}/deck-gl/examples) section you can find interactive examples using the scripting API. Here we show how you can download and run the React and pure JS examples. These are small, standalone examples that could be a good starting point for your application showing how to integrate CARTO for deck.gl in a React application or how to use it with webpack and pure JS.

You should be able to copy these folders to your preferred locations, and get them running simply as follows:

Clone the CARTO viz-doc [repo](https://github.com/CartoDB/viz-doc), if you haven't already.

```console
git clone git@github.com:CartoDB/viz-doc.git
```   

Change directory to the example you are interested in, e.g.

```console
cd viz-doc/deck.gl/examples/pure-js
```   

Then install the dependencies using the installer of your choice:

```console
npm install
```   

or

```console
yarn
```   

Finally run the example using:

```console
npm start
```   

or

```console
yarn start
```   
   
