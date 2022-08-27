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
    HCanvasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FlexLayoutModule,
    HttpClientModule,
    FormsModule,
    SocketIoModule.forRoot({ url: 'http://192.168.1.55:8080', options: { } })
  ],
  providers: [MakerApiService, DragService, DashboardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
