import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Subscription } from "rxjs";

import intersects from '@turf/boolean-intersects';

import { StoresLayer } from "../../layers/stores-layer";
import { MapService } from "../../../../services/map.service";
import { numberFormatter } from '../../../../../utils/formatter';

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
        this.setChartDataWithViewportFeatures(this.storesData);
      })
    );

    this.subscription.add(
      this.mapService.onViewStateChange.subscribe((viewportBbox: any) => {
        if (viewportBbox && this.storesData) {
          const viewportFeatures = getViewportFeatures(this.storesData, viewportBbox);
          this.setChartDataWithViewportFeatures(viewportFeatures);
        }
      })
    );
  }

  setChartDataWithViewportFeatures(features: any) {
    const groupedValues = groupValuesByColumn(features, 'revenue', 'storetype');
    this.setOptions(groupedValues);
  }

  setOptions(data: any) {
    this.chartOptions = {
      grid: {
        left: 40
      },
      title: {
        text: 'Stores by type',
        textStyle: {
          fontFamily: 'Montserrat, "Open Sans", sans-serif'
        }
      },
      xAxis: {
        type: 'category',
        data: data.map((d: any) => d.category),
        axisLabel: {
          show: true,
          rotate: 40,
          fontSize: 11
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
          fontFamily: 'Montserrat, "Open Sans", sans-serif'
        },
        formatter: `{b}: {c}`
      },
      series: [{
        data: data.map((d: any) => d.value),
        type: 'bar',
        itemStyle: {
          color: '#47db99'
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
    return [{category: '', value: 0}];
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
