import { Component, OnInit } from '@angular/core';
import { Dashboard } from 'projects/models/src/lib/dashboard-api/dashboard';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.scss']
})
export class DashboardsComponent implements OnInit {

  private dashboards: Dashboard[];
  dashboards$: Observable<Dashboard[]>;

  constructor() {
    this.dashboards = [
      {
        id: 1,
        height:8,
        width: 8,
        name: 'Home'
      },
      {
        id: 2,
        height:8,
        width: 8,
        name: 'Office'
      }
    ];

    this.dashboards$ = of(this.dashboards);
  }

  newDashboard(): void {
    this.dashboards.push({
      id: 3,
      height:8,
      width: 8,
      name: 'Bedroom'
    });
  }

  ngOnInit(): void {

  }

}
