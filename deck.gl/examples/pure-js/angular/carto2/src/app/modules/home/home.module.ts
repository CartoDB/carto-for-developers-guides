import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatDividerModule } from "@angular/material/divider";

import { NgxEchartsModule } from "ngx-echarts";
import * as echarts from 'echarts';

import { AppRoutingModule } from "../../app-routing.module";
import { SharedModule } from "../shared/shared.module";
import { HomeComponent } from "./home.component";
import { SidebarComponent } from './views/sidebar/sidebar.component';
import { ChartComponent } from "./components/chart/chart.component";
import { ToggleComponent } from './components/toggle/toggle.component';
import { RailRoadsLayer } from './layers/rail-roads-layer';
import { BuildingsLayer } from './layers/buildings-layer';
import { StoresLayer } from './layers/stores-layer';

@NgModule({
  declarations: [
    HomeComponent,
    SidebarComponent,
    ChartComponent,
    ToggleComponent
  ],
  providers: [RailRoadsLayer, BuildingsLayer, StoresLayer],
  imports: [
    CommonModule,
    SharedModule,
    AppRoutingModule,
    NgxEchartsModule.forRoot({
      echarts
    }),
    MatSlideToggleModule,
    MatGridListModule,
    MatDividerModule
  ],
})
export class HomeModule {
}
