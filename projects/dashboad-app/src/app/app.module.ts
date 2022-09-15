import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardsComponent } from './dashboards/dashboards.component';
import { DashboardComponent } from './dashboards/dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MakerApiService } from '../services/maker-api.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { LightTileComponent } from './components/tiles/light-tile/light-tile.component';
import { TileComponent } from './components/tiles/tile/tile.component';
import { SocketIoModule } from 'ngx-socket-io';
import { DropListComponent } from './components/drop-list/drop-list.component';
import { VerticalSliderComponent } from './components/vertical-slider/vertical-slider.component';
import { SensorTileComponent } from './components/tiles/sensor-tile/sensor-tile.component';
import { ThermostatTileComponent } from './components/tiles/thermostat-tile/thermostat-tile.component';
import { ButtonSliderComponent } from './components/button-slider/button-slider.component';
import { HighlightDirective } from './directives/drag-start.directive';
import { DragService } from './directives/drag-start.service';
import { HCanvasComponent } from './components/h-canvas/h-canvas.component';
import { ColorSliderComponent } from './components/color-slider/color-slider.component';
import { DashboardService } from '../services/dashboard.service';
import { ProfileService } from '../services/profile.service';
import { GroupsComponent } from './groups/groups.component';
import { GroupComponent } from './groups/group/group.component';
import { RoomsComponent } from './rooms/rooms.component';
import { RoomComponent } from './rooms/room/room.component';
import { SelectListComponent } from './components/select-list/select-list.component';
import { RoomService } from '../services/room.service';
import { IsLightPipe } from './pipes/is-light.pipe';
import { IsSensorPipe } from './pipes/is-sensor.pipe';
import { DeviceListItemComponent } from './components/device-list-item/device-list-item.component';
import { LightListItemComponent } from './components/device-list-item/light-list-item/light-list-item.component';
import { SensorListItemComponent } from './components/device-list-item/sensor-list-item/sensor-list-item.component';
import { ThermostatListItemComponent } from './components/device-list-item/thermostat-list-item/thermostat-list-item.component';
import { SwitchListItemComponent } from './components/device-list-item/switch-list-item/switch-list-item.component';
import { IsSwitchPipe } from './pipes/is-switch.pipe';
import { environment } from '../environments/environment';
import { AnyOnPipe } from './pipes/any-on.pipe';
import { ThermostatPipe } from './pipes/thermostat.pipe';
import { HomeComponent } from './home/home.component';
import { TemperaturePipe } from './pipes/temperature.pipe';
import { AttributePipe } from './pipes/attribute.pipe';
import { ColorAveragePipe } from './pipes/color-average.pipe';

@NgModule({
  declarations: [
    AppComponent,
    DashboardsComponent,
    DashboardComponent,
    LightTileComponent,
    TileComponent,
    DropListComponent,
    VerticalSliderComponent,
    SensorTileComponent,
    ThermostatTileComponent,
    ButtonSliderComponent,
    ColorSliderComponent,
    HighlightDirective,
    HCanvasComponent,
    GroupsComponent,
    GroupComponent,
    RoomsComponent,
    RoomComponent,
    SelectListComponent,
    IsLightPipe,
    IsSensorPipe,
    DeviceListItemComponent,
    LightListItemComponent,
    SensorListItemComponent,
    ThermostatListItemComponent,
    SwitchListItemComponent,
    IsSwitchPipe,
    AnyOnPipe,
    ThermostatPipe,
    HomeComponent,
    TemperaturePipe,
    AttributePipe,
    ColorAveragePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FlexLayoutModule,
    HttpClientModule,
    FormsModule,
    SocketIoModule.forRoot({ url: environment.apiUrl, options: { } })
  ],
  providers: [MakerApiService, DragService, DashboardService, ProfileService, RoomService, AnyOnPipe, ThermostatPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
