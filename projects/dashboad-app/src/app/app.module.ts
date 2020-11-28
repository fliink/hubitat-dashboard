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

@NgModule({
  declarations: [
    AppComponent,
    DashboardsComponent,
    DashboardComponent,
    LightTileComponent,
    TileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FlexLayoutModule,
    HttpClientModule,
    FormsModule,
    SocketIoModule.forRoot({ url: 'http://localhost:8080', options: { } })
  ],
  providers: [MakerApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
