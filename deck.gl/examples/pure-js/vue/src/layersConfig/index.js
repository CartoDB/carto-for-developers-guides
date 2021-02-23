export const layersInfo = {
  buildings: {
    id: 'buildings-layer',
    data: 'cartobq.maps.msft_buildings',
    isVisible: false,
    toggleLabel: 'Buildings'
  },
  railRoads: {
    id: 'rail-road-layer',
    data: 'SELECT cartodb_id, the_geom_webmercator, scalerank FROM ne_10m_railroads_public',
    isVisible: true,
    toggleLabel: 'Rail Roads'
  },
  stores: {
    id: 'stores-layer',
    data: 'SELECT * FROM retail_stores',
    isVisible: true,
    toggleLabel: 'Stores'
  }
}
