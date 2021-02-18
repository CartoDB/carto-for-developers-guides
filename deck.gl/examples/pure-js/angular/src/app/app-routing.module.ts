import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './models/home/home.component';
import { SidebarComponent } from "./models/home/views/sidebar/sidebar.component";

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
