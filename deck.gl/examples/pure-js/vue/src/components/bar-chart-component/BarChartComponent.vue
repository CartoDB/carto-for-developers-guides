/**
 *  BarChartComponent.vue
**/
/* template import */
<template src="./bar.chart.component.html"></template>
/* style import */
<style scoped lang="scss" src="./bar.chart.component.scss"></style>
<script>
import { mapState } from 'vuex'
import { MODULE_NAME } from '@/store/map'
import ECharts from 'vue-echarts'
import * as echarts from 'echarts'
import { CanvasRenderer } from 'echarts/renderers'

const { use } = echarts

use([CanvasRenderer])

export default {
  components: {
    'v-chart': ECharts,
  },
  data: () => ({
    bar: {
      grid: {
        left: 55,
        right: 55
      },
      title: {
        text: 'Stores by type',
        textStyle: {
          fontFamily: 'Montserrat, "Open Sans", sans-serif',
          fontSize: '1.125rem'
        }
      },
      xAxis: {
        type: 'category',
        data: [],
        axisLabel: {
          show: true,
          rotate: 40,
          fontSize: 11,
          fontFamily: 'Montserrat, "Open Sans", sans-serif',
          formatter: v => v.replace(/ Store/g, ''),
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          fontSize: 11,
          fontFamily: 'Montserrat, "Open Sans", sans-serif',
          formatter: v => `${v / 1e6}M`
        }  
      },
      series: {
        type: 'bar',
        data: [],
        color: '#47db99'
      },
      tooltip: {
        trigger: 'item',
        textStyle: {
          fontSize: 15,
        },
        formatter: params => `${(params.value / 1e6).toFixed(0)}M`
      }
    },
    isLoading: true
  }),
  computed: {
    ...mapState(MODULE_NAME, ['viewportFeatures'])
  },
  watch: {
    viewportFeatures(data) {
      const groupedValues = groupValuesByColumn(data, 'revenue', 'storetype');
      const { xAxis, series } = this.bar;
      xAxis.data = groupedValues.map((d) => d.category);
      series.data = groupedValues.map((d) => d.value);
      this.isLoading = false;
    }
  }
};

function groupValuesByColumn(data, valuesColumn, keysColumn) {
  if (Array.isArray(data) && data.length === 0) {
    return [{category: '', value: 0}];
  }

  const groups = data.reduce((accumulator, item) => {
    const group = item.properties[keysColumn];

    accumulator[group] = accumulator[group] || [];

    const isValid = item.properties[valuesColumn] !== null && item.properties[valuesColumn] !== undefined;

    if (isValid) {
      accumulator[group].push(item.properties[valuesColumn]);
    }

    return accumulator;
  }, {});

  return Object.entries(groups).map(([category, value]) => ({
    category,
    value: sum(value)
  }));
}

const sum = (values, key) => {
  const fn = key ? (a, b) => a + b[key] : (a, b) => a + b;
  return values.reduce(fn, 0);
};
</script>
