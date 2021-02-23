/**
 *  Layer.vue
**/
<script>
export default {
  name: 'Layer',
  props: {
    layer: {
      type: Object,
      required: true,
      validator: function (value) {
        return Object.prototype.hasOwnProperty.call(value, 'id')
      }
    },
    map: {
      type: Object,
      required: true
    },
    mapConfig: {
      type: Object,
      required: true
    }
  },
  created () {
    this.layer.init(this.map, this.mapConfig)
  },
  beforeDestroy () {
    this.layer.destroy()
  },
  render () {
    return null
  }
}
</script>
