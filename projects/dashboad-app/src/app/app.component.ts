import { Component } from '@angular/core';
import { profile } from 'console';
import { Dashboard } from 'projects/models/src/lib/dashboard-api/dashboard';
import { Observable, of } from 'rxjs';
import { DashboardService } from '../services/dashboard.service';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(profileSvc: ProfileService, dashboardSvc: DashboardService) {
    profileSvc.load();
    dashboardSvc.load().subscribe();
  }
}
