import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
// import { Store } from '@ngrx/store';
import { numberFormatter } from '../../../../../utils/formatter';
import { interval, Subscription } from "rxjs";
import { debounce } from "rxjs/operators";

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComponent implements OnInit {
  chartOptions: {};
  subscription: Subscription;

  constructor(
    // private store: Store<{ reducer: StoreT }>,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    // this.subscription = this.store.select('reducer')
    //     .pipe(debounce(() => interval(250)))
    //     .subscribe((state: StoreT) => {
    //       if (state.viewportFeatures) {
    //         const groupedValues = groupValuesByColumn(state.viewportFeatures, 'revenue', 'storetype');
    //         this.setOptions(groupedValues);
    //       }
    // });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
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
        data: data.map((d: any) => d.category),
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
        data: data.map((d: any) => d.value),
        type: 'bar',
        itemStyle: {
          color: '#036fe2'
        }
      }]
    };
    this.cdr.detectChanges();
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
