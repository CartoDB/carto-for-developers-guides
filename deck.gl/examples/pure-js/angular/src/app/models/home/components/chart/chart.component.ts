import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { WebMercatorViewport } from '@deck.gl/core';
import bboxPolygon from '@turf/bbox-polygon';
import intersects from '@turf/boolean-intersects';
import { StoresLayer } from "../../layers/stores-layer";
import { MapService } from "../../../../services/map.service";
import { numberFormatter } from '../../../../../utils/formatter';
import { Subscription } from "rxjs";

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComponent implements OnInit {
  chartOptions: {};
  subscription: Subscription = new Subscription();
  storesData: any;
  viewportBbox: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private storesLayer: StoresLayer,
    private mapService: MapService
  ) {
  }

  ngOnInit() {
    this.subscription.add(
      this.storesLayer.dataLoaded.subscribe(data => {
        this.storesData = data;
      })
    );

    this.subscription.add(
      this.mapService.onViewStateChange.subscribe((viewportBbox: any) => {
        if (viewportBbox && this.storesData) {
          this.setChartDataWithViewportFeatures(viewportBbox);
        }
      })
    );
  }

  setChartDataWithViewportFeatures(viewportBbox: any) {
    const viewportFeatures = getViewportFeatures(this.storesData, viewportBbox);
    const groupedValues = groupValuesByColumn(viewportFeatures, 'revenue', 'storetype');
    this.setOptions(groupedValues);
  }

  setOptions(data: any) {
    this.chartOptions = {
      grid: {
        left: 40
      },
      title: {
        text: 'Stores by type'
      },
      xAxis: {
        type: 'category',
        data: Object.values(data).map((d: any) => d.category),
        axisLabel: {
          show: true,
          rotate: 40,
          textStyle: {
            fontSize: 11
          }
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (v: number) => numberFormatter(v)
        }
      },
      tooltip: {
        trigger: 'item',
        textStyle: {
          fontSize: '15',
        },
        formatter: `{b}: {c}`
      },
      series: [{
        data: Object.values(data).map((d: any) => d.value),
        type: 'bar',
        itemStyle: {
          color: '#036fe2'
        }
      }]
    };

    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

function getViewportFeatures(features: any, viewport: any) {
  return features.filter((f: any) => intersects(f, viewport));
}

function groupValuesByColumn(data: [], valuesColumn: string, keysColumn: string) {
  if (Array.isArray(data) && data.length === 0) {
    return null;
  }

  const groups = data.reduce((accumulator: any, item: any) => {
    const group = item.properties[keysColumn];

    accumulator[group] = accumulator[group] || [];

    const isValid = item.properties[valuesColumn] !== null && item.properties[valuesColumn] !== undefined;

    if (isValid) {
      accumulator[group].push(item.properties[valuesColumn]);
    }

    return accumulator;
  }, {});

  return Object.entries(groups).map(([category, value]: [string, any]) => ({
    category,
    value: value.length
  }));
}
