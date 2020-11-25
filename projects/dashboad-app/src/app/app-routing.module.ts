import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboards/dashboard/dashboard.component';
import { DashboardsComponent } from './dashboards/dashboards.component';

const routes: Routes = [{
  path: '',
  pathMatch: 'full',
  redirectTo: 'dashboards'
}, {
  path: 'dashboards',
  component: DashboardsComponent
}, {
  path: 'dashboards/:id',
  component: DashboardComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
