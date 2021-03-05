/**
 *  Home.vue
**/
/* template import */
<template src="./home.html"></template>
/* style import */
<style lang="scss" src="./home.scss"></style>
<script>
import { mapMutations, mapState, mapGetters } from 'vuex'
import { MODULE_NAME, MUTATIONS, GETTERS } from '@/store/map'
import { GeoJsonLayer } from '@deck.gl/layers'
import { CartoBQTilerLayer, CartoSQLLayer, setDefaultCredentials, colorCategories, colorContinuous } from '@deck.gl/carto'
import TemplateComponent from '@/components/template-component/TemplateComponent.vue';
import layerService from '@/services/layerService'
import { viewportFeaturesFunctions } from '@/utils/viewportFeatures'

export default {
  name: 'app-home',
  components: {
    TemplateComponent
  },
  data: () => ({
    storesData: []
  }),
  mounted () {
    setDefaultCredentials(this.credentials);

    layerService.addLayer({
      id: 'roads',
      layerType: CartoSQLLayer,
      data: 'SELECT cartodb_id, the_geom_webmercator, scalerank FROM ne_10m_railroads_public',
      pickable: true,
      lineWidthScale: 20,
      lineWidthMinPixels: 2,
      autoHighlight: true,
      highlightColor: [0, 255, 0],
      getLineColor: colorContinuous({
        attr: 'scalerank',
        domain: [1, 2, 3, 4, 5, 10],
        colors: 'BluYl'
      })
    })

    const storesQuery = 'SELECT * FROM retail_stores';
    const storesUrl = `https://public.carto.com/api/v2/sql?q=${storesQuery}&format=geojson`;
    layerService.addLayer({
      id: 'stores',
      layerType: GeoJsonLayer,
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

    layerService.addLayer({
      id: 'buildings',
      layerType: CartoBQTilerLayer,
      data: 'cartobq.maps.msft_buildings',
      visible: false,
      pointRadiusUnits: 'pixels',
      getFillColor: [240, 142, 240]
    })
  },
  methods: {
    ...mapMutations(MODULE_NAME, [MUTATIONS.SET_VIEWPORT_FEATURES])
  },
  computed: {
    ...mapState(MODULE_NAME, ['viewState']),
    ...mapGetters(MODULE_NAME, {
      credentials: GETTERS.GET_CREDENTIALS
    })
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
