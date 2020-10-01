## Getting started

In this guide, you will learn how to install CARTO for deck.gl in your computer and run the examples.

### Installation

You can work with CARTO for deck.gl with the NPM module for React or Pure JS applications:

```console
foo@bar:~$ npm install @deck.gl
foo@bar:~$ npm install @deck.gl/carto
```   

Or you can use the scripting API:

```html
<script src="https://unpkg.com/deck.gl@latest/dist.min.js"></script>
<script src="https://unpkg.com/@deck.gl/carto@latest/dist.min.js"></script>
```   

You can learn more about deck.gl on the official [website](https://deck.gl), where you can find a dedicated section on the @deck.gl/carto [submodule](https://deck.gl/docs/api-reference/carto/overview).

### Examples

In the [Examples]({{site.baseurl}}/deck-gl/examples) section you can find interactive examples using the scripting API. Here we show how you can download and run the React and pure JS examples. These are small, standalone examples that could be a good starting point for your application showing how to add different CARTO layers, how to integrate in a React application or how to use it with webpack and pure JS.

You should be able to copy these folders to your preferred locations, and get them running simply as follows:

Clone the CARTO viz-doc [repo](https://github.com/CartoDB/viz-doc), if you haven't already.

```console
foo@bar:~$ git clone git@github.com:CartoDB/viz-doc.git
```   

Change directory to the example you are interested in, e.g.

```console
foo@bar:pure-js$ cd viz-doc/deck.gl/examples/pure-js
```   

Then install the dependencies using the installer of your choice:

```console
foo@bar:pure-js$ npm install
```   

or

```console
foo@bar:pure-js$ yarn
```   

Finally run the example using:

```console
foo@bar:pure-js$ npm start
```   

or

```console
foo@bar:pure-js$ yarn start
```   
   
