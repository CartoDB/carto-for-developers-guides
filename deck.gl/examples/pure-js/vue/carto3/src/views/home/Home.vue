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
import { CartoLayer, MAP_TYPES, FORMATS, getData, setDefaultCredentials, colorCategories, colorContinuous } from '@deck.gl/carto'
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
  async mounted () {
    setDefaultCredentials(this.credentials);

    layerManager.addLayer(
      new CartoLayer({
        id: 'railroads',
        connection: 'bqconn',
        type: MAP_TYPES.QUERY,
        data: 'SELECT geom, scalerank FROM cartobq.public_account.ne_10m_railroads_public',
        pickable: true,
        lineWidthScale: 20,
        lineWidthMinPixels: 2,
        autoHighlight: true,
        highlightColor: [0, 255, 0],
        pointRadiusMinPixels: 2.5,
        getLineColor: colorContinuous({
          attr: 'scalerank',
          domain: [4, 5, 6, 7, 8, 9, 10],
          colors: 'BluYl'
        })
      })
    )

    const geojsonData = await getData({
      type: MAP_TYPES.TABLE,
      source: `cartobq.public_account.retail_stores`,
      connection: 'bqconn',
      format: FORMATS.GEOJSON
    })
    this.storesData = geojsonData.features
    layerManager.addLayer(
      new GeoJsonLayer({
        id: 'stores',
        data: geojsonData.features,
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
      })
    )

    layerManager.addLayer(
      new CartoLayer({
        id: 'buildings',
        connection: 'bqconn',
        type: MAP_TYPES.TILESET,
        data: 'cartobq.public_account.msft_buildings',
        visible: false,
        pointRadiusUnits: 'pixels',
        getFillColor: [240, 142, 240]
      })
    )

    this[MUTATIONS.SET_MAP_LOADED](true)
  },
  methods: {
    ...mapMutations(MODULE_NAME, [
      MUTATIONS.SET_VIEWPORT_FEATURES,
      MUTATIONS.SET_MAP_LOADED
    ])
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
