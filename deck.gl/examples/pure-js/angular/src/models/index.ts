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

export type StoreT = {
  layersVisibility: LayersState,
  geojsonData: [],
  bounds: [],
  viewportFeatures: []
}

export type Payload = {
  payload: []
}