import { Component, OnInit } from '@angular/core';
import { Dashboard, DashboardTile } from 'projects/models/src/lib/dashboard-api/dashboard';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  dashboard: Dashboard = { id: 0, name: '', height: 10, width: 10 };
  tiles: { row: number, column: number }[] = [];
  constructor() { }

  ngOnInit(): void {
    for (let i = 1; i <= this.dashboard.height; i++) {
      for (let j = 1; j <= this.dashboard.width; j++) {
        this.tiles.push({
          row: i,
          column: j
        });
      }
    }
  }

}
