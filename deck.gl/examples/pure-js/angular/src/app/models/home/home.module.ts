import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from "./home.component";
import { SharedModule } from "../shared/shared.module";
import { SidebarComponent } from './views/sidebar/sidebar.component';
import { HomeRoutingModule } from "./home-routing.module";
import { ChartComponent } from "./components/chart/chart.component";
import { NgxEchartsModule } from "ngx-echarts";
import * as echarts from 'echarts';
import { AirportLayer } from "./layers/airport-layer";

@NgModule({
  declarations: [
    HomeComponent,
    SidebarComponent,
    ChartComponent
  ],
  providers: [AirportLayer],
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule,
    NgxEchartsModule.forRoot({
      echarts
    })
  ]
})
export class HomeModule {
}
