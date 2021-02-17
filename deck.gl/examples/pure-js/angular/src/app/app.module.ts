import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TemplateComponent } from '../components/template/template.component';
import { MapComponent } from '../components/map/map.component';
import { ToggleComponent } from '../components/toggle/toggle.component';
import { ChartComponent } from '../components/chart/chart.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatGridListModule } from '@angular/material/grid-list';

import * as echarts from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';

import { StoreModule } from '@ngrx/store';
import { appReducer } from '../store/reducers';

@NgModule({
  declarations: [
    AppComponent,
    TemplateComponent,
    MapComponent,
    ChartComponent,
    ToggleComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatGridListModule,
    StoreModule.forRoot({ reducer: appReducer }),
    NgxEchartsModule.forRoot({
      echarts
    })
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
