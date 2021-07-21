/**
 *  Home.vue
**/
/* template import */
<template src="./home.html"></template>
/* style import */
<style lang="scss" src="./home.scss"></style>
<script>
import { mapMutations, mapState } from 'vuex'
import { MODULE_NAME, MUTATIONS } from '@/store/map'
import { GeoJsonLayer } from '@deck.gl/layers'
import { CartoLayer, MAP_TYPES, setDefaultCredentials, colorCategories, colorContinuous } from '@deck.gl/carto'
import ViewTemplate from '@/components/view-template/ViewTemplate.vue';
import layerManager from '@/components/map-component/map-utils/layerManager'
import { viewportFeaturesFunctions } from '@/utils/viewportFeatures'

export default {
  name: 'app-home',
  components: {
    ViewTemplate
  },
  data: () => ({
    storesData: []
  }),
  mounted () {
    setDefaultCredentials(this.credentials);

    layerManager.addLayer(
      new CartoLayer({
        id: 'railroads',
        type: MAP_TYPES.QUERY,
        data: 'SELECT cartodb_id, the_geom_webmercator, scalerank FROM ne_10m_railroads_public',
        pickable: true,
        lineWidthScale: 20,
        lineWidthMinPixels: 2,
        autoHighlight: true,
        highlightColor: [0, 255, 0],
        getLineColor: colorContinuous({
          attr: 'scalerank',
          domain: [4, 5, 6, 7, 8, 9, 10],
          colors: 'BluYl'
        })
      })
    )

    const storesQuery = 'SELECT * FROM retail_stores';
    const storesUrl = `https://public.carto.com/api/v2/sql?q=${storesQuery}&format=geojson`;
    layerManager.addLayer(
      new GeoJsonLayer({
        id: 'stores',
        data: storesUrl,
        pointRadiusUnits: 'pixels',
        lineWidthUnits: 'pixels',
        pickable: true,
        getRadius: 3,
        autoHighlight: true,
        highlightColor: [0, 255, 0],
        getFillColor: colorCategories({
          attr: 'storetype',
          domain: ['Supermarket', 'Discount Store', 'Hypermarket', 'Drugstore', 'Department Store'],
          colors: 'Pastel'
        }),
        onDataLoad: data => this.storesData = data.features
      })
    )

    layerManager.addLayer(
      new CartoLayer({
        id: 'buildings',
        type: MAP_TYPES.TILESET,
        data: 'cartobq.maps.msft_buildings',
        visible: false,
        pointRadiusUnits: 'pixels',
        getFillColor: [240, 142, 240]
      })
    )
  },
  methods: {
    ...mapMutations(MODULE_NAME, [MUTATIONS.SET_VIEWPORT_FEATURES])
  },
  computed: {
    ...mapState(MODULE_NAME, ['viewState', 'credentials'])
  },
  watch: {
    viewState(v) {
      const viewportFeatures = viewportFeaturesFunctions.compute(v, this.storesData)
      this[MUTATIONS.SET_VIEWPORT_FEATURES](viewportFeatures)
    },
    storesData(d) {
      this[MUTATIONS.SET_VIEWPORT_FEATURES](d)
    }
  }
}
</script>
