# CARTO AUTH SPA example

CARTO Single Page Application (SPA) example that shows how to get a CARTO OAuth Token in a SPA.

It's implemented in Vanilla JavaScript, so you can use it in any Javascript Framework like Angular, React, Vue, etc.

How to use:

1. Create a SPA application in CARTO Workspace. More info [here](https://docs.carto.com/carto-user-manual/developers/managing-applications)
2. Modify .env and include the CLIENT ID you created at step 1.
3. Run the project `npm i && npm run dev`

### About the implementation in this example

CARTO platform uses [Auth0](https://auth0.com/) for authentication and authorization. This example uses the [Auth0 Single Page App SDK](https://auth0.com/docs/libraries/auth0-single-page-app-sdk) to show case how to call a CARTO API and how to visualize a layer.