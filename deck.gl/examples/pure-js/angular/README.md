# CARTO for deck.gl + Angular example

This example demonstrates how to build an application with Angular and CARTO for deck.gl including common location intelligence apps functionality like:

- Multiple types of layers (CARTO dataset, BigQuery tileset, GeoJSON source)
- Layer selector component
- Interactivity
- Chart synchronized with map

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.2.0.

## Development server

Run `ng serve` for starting a development server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Deployment

This example is hosted in `https://angular-carto.web.app/` using Firebase. You need to have access to the configured Firebase project and log before deploying using:

```shell
$ firebase login
```

Then, just build the example and deploy it by executing:

```bash
$ ng build
$ firebase deploy
```