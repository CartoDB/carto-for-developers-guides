import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatGridListModule } from '@angular/material/grid-list';

import * as echarts from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';

import { HeaderComponent } from './components/header/header.component';
import { AppRoutingModule } from "./app-routing.module";
import { CommonModule } from "@angular/common";
import { HomeModule } from "./models/home/home.module";
import { MapService } from "./services/map.service";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    HomeModule
    // MatSlideToggleModule,
    // MatGridListModule,
    // NgxEchartsModule.forRoot({
    //   echarts
    // })
  ],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [MapService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
