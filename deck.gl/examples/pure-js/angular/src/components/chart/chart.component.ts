import { Component, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { StoreT } from '../../models';
import { currencyFormatter } from '../../utils/formatter';

@Component({
  selector: 'chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements AfterViewInit {
  chartOptions: {};

  constructor(private store: Store<{ reducer: StoreT }>) {}

  ngAfterViewInit() {
    this.store.select('reducer').subscribe((state: StoreT) => {
      if (state.viewportFeatures) {
        const groupedValues = groupValuesByColumn(state.viewportFeatures, 'revenue', 'storetype');
        this.setOptions(groupedValues);
      }
    });
  }

  setOptions(data: any) {
    this.chartOptions = {
      title: {
        text: 'Stores by type'
      },
      xAxis: {
        type: 'category',
        data: data.map((d: any) => d.category),
        axisLabel: {
          show: true,
          rotate: 40
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          show: true,
          textStyle: {
            fontSize: 8
          }
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
        data: data.map((d: any) => d.value),
        type: 'bar',
        itemStyle: {
          color: '#036fe2'
        }
      }]
    };
  }
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
    value: value.reduce((a: number, b: number) => a + b, 0)
  }));
}
  