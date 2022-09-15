import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HCanvasComponent } from './components/h-canvas/h-canvas.component';
import { DashboardComponent } from './dashboards/dashboard/dashboard.component';
import { DashboardsComponent } from './dashboards/dashboards.component';
import { GroupsComponent } from './groups/groups.component';
import { HomeComponent } from './home/home.component';
import { RoomComponent } from './rooms/room/room.component';
import { RoomsComponent } from './rooms/rooms.component';

const routes: Routes = [{
  path: '',
  pathMatch: 'full',
  redirectTo: 'rooms'
}, {
  path: 'canvas',
  component: HCanvasComponent
},{
  path: 'dashboards',
  component: DashboardsComponent
}, {
  path: 'dashboards/:id',
  component: DashboardComponent
},{
  path: 'rooms/:id',
  component: RoomComponent
},{
  path: 'rooms',
  component: RoomsComponent
},{
  path: 'home',
  component: HomeComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
