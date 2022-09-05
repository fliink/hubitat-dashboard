import { Component, OnInit } from '@angular/core';
import { Dashboard } from 'projects/models/src/lib/dashboard-api/dashboard';
import { Observable, of } from 'rxjs';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.scss']
})
export class DashboardsComponent implements OnInit {

  private dashboards: Dashboard[];
  dashboards$: Observable<Dashboard[]>;

  constructor( dashboardSvc: DashboardService) {
    this.dashboards$ = dashboardSvc.dashboards$;
  }

  ngOnInit(): void {

  }

}
