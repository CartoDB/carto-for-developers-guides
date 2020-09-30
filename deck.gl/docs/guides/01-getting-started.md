## Getting started

In this guide, you will learn how to install CARTO for deck.gl in your computer and run the examples.

### Installation

You can work with CARTO for deck.gl with the NPM module for React or Pure JS applications:

`npm install @deck.gl`

`npm install @deck.gl/carto`

Or you can use the scripting API:

`<script src="https://unpkg.com/deck.gl@latest/dist.min.js"></script>`

`<script src="https://unpkg.com/deck.gl@latest/carto/dist.min.js"></script>`

You can learn more about deck.gl on the official [website](https://deck.gl), where you can find a dedicated section on the @deck.gl/carto [submodule](https://deck.gl/docs/api-reference/carto/overview).

### Examples

In the [Examples]({{site.baseurl}}/deck-gl/examples) section you can find interactive examples using the scripting API. Here we show how you can download and run the React and PureJS examples. These are small, standalone examples that could be a good starting point for your application showing how to add different CARTO layers, how to integrate in a React application or how to use it with webpack and PureJS.

You should be able to copy these folders to your preferred locations, and get them running simply as follows:

1. Clone the CARTO viz-doc [repo](https://github.com/CartoDB/viz-doc), if you haven't already.

  `git clone git@github.com:CartoDB/viz-doc.git`

2. Change directory to the example you are interested in, e.g.

  `cd viz-doc/deck.gl/examples/pure-js`

3. Then install dependencies using the installer of your choice:

   `npm install`

or

   `yarn`

4. Finally run the example using:

   `npm start`

or

   `yarn start`
