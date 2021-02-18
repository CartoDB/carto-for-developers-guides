import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from "./home.component";
import { SharedModule } from "../shared/shared.module";
import { SidebarComponent } from './views/sidebar/sidebar.component';
import { HomeRoutingModule } from "./home-routing.module";
import { ChartComponent } from "./components/chart/chart.component";
import { NgxEchartsModule } from "ngx-echarts";
import * as echarts from 'echarts';
import { RailRoadsLayer } from './layers/rail-roads-layer';
import { BuildingsLayer } from './layers/buildings-layer';
import { StoresLayer } from './layers/stores-layer';
import { ToggleComponent } from './components/toggle/toggle.component';
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatGridListModule } from "@angular/material/grid-list";

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
    HomeRoutingModule,
    NgxEchartsModule.forRoot({
      echarts
    }),
    MatSlideToggleModule,
    MatGridListModule
  ],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeModule {
}
