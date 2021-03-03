import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { DashboardTile } from 'projects/models/src/lib/dashboard-api/dashboard';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss'],
})
export class TileComponent implements OnInit {
  @HostBinding('style.gridColumn') gridColumn: string = '';
  @HostBinding('style.gridRow') gridRow: string = '';
  @HostBinding('style.gridRowEnd') gridRowEnd: string = '';
  @HostBinding('style.gridColumnEnd') gridColumnEnd: string = '';
  
  @Input() config: DashboardTile = undefined;
  @Output() activated: EventEmitter<boolean> = new EventEmitter();

  constructor() { 
   
  }

  ngOnInit(): void {
    this.gridColumn = `${this.config.position.left}`;
    this.gridRow = `${this.config.position.top}`;
    this.gridRowEnd = `${this.config.position.bottom}`;
    this.gridColumnEnd = `${this.config.position.right}`;
  }

  activate(){
    this.activated.next(true);
  }

}
