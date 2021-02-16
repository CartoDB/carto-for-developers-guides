export enum Layers {
  SQL = 'sql',
  BIGQUERY = 'bigquery',
  GEOJSON = 'geojson'
}

export type LayersState = {
  [Layers.SQL]: boolean,
  [Layers.BIGQUERY]: boolean,
  [Layers.GEOJSON]: boolean
}

export type LayersVisibility = {
  layersVisibility: LayersState
}