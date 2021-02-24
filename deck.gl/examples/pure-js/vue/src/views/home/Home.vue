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
import TemplateComponent from '@/components/template-component/TemplateComponent.vue';
import { CartoBQTilerLayer, CartoSQLLayer, setDefaultCredentials, colorCategories, colorContinuous } from '@deck.gl/carto'
import { GeoJsonLayer } from '@deck.gl/layers'
import layerService from '@/services/layerService'
import { layersInfo } from '@/layersConfig'
import htmlForFeature from '@/utils/htmlForFeature'
import { viewportFeaturesFunctions } from '@/utils/viewportFeatures'

setDefaultCredentials({
  username: 'public',
  apiKey: 'default_public'
});

export default {
  name: 'app-home',
  components: {
    TemplateComponent
  },
  data: () => ({
    storesData: []
  }),
  mounted () {
    const { buildings, railRoads, stores } = layersInfo;

    layerService.addLayer({
      id: buildings.id,
      layerType: CartoBQTilerLayer,
      data: buildings.data,
      visible: buildings.isVisible,
      pointRadiusUnits: 'pixels',
      getFillColor: [240, 142, 240],
      getFileColor: [240, 142, 240]
    })

    layerService.addLayer({
      id: railRoads.id,
      layerType: CartoSQLLayer,
      data: railRoads.data,
      visible: railRoads.isVisible,
      pickable: true,
      lineWidthScale: 20,
      lineWidthMinPixels: 2,
      autoHighlight: true,
      highlightColor: [0, 255, 0],
      getLineColor: colorContinuous({
        attr: 'scalerank',
        domain: [1, 2, 3, 4, 5, 10],
        colors: 'BluYl'
      }),
      onHover: (info) => {
        if (info?.object) {
          info.object = {
            html: htmlForFeature({
              feature: info.object,
              includeColumns: ['scalerank'],
              showColumnName: true
            }),
          };
        }
      }
    })

    layerService.addLayer({
      id: stores.id,
      layerType: GeoJsonLayer,
      data: `https://public.carto.com/api/v2/sql?q=${stores.data}&format=geojson`,
      visible: stores.isVisible,
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
      onDataLoad: data => this.storesData = data.features,
      onHover: (info) => {
        if (info?.object) {
          info.object = {
            html: htmlForFeature({
              title: `store ${info.object.properties.store_id}`,
              feature: info.object,
              formatter: {
                type: 'number',
                columns: ['revenue'],
              },
              includeColumns: ['revenue'],
              showColumnName: true
            }),
          };
        }
      }
    })
  },
  methods: {
    ...mapMutations(MODULE_NAME, [MUTATIONS.SET_VIEWPORT_FEATURES])
  },
  computed: {
    ...mapState(MODULE_NAME, ['viewState']),
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
