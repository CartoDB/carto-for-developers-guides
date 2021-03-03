import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './modules/home/home.component';
import { SidebarComponent } from "./modules/home/views/sidebar/sidebar.component";

const routes: Routes = [
  {
    path: '', component: HomeComponent, children: [
      {
        path: '',
        component: SidebarComponent,
        outlet: 'home'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
