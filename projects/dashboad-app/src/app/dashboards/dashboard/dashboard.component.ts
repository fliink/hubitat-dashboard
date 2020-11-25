import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Dashboard, DashboardTile } from 'projects/models/src/lib/dashboard-api/dashboard';
import { element } from 'protractor';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  @ViewChild('grideditor') gridEditor: ElementRef<HTMLDivElement>;

  dashboard: Dashboard = { id: 0, name: '', height: 10, width: 10 };
  tiles: { row: number, column: number }[] = [];
  activeTile: { element: HTMLElement, start: { row: number, column: number }};

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

  dragStart(dragEvent: DragEvent, tile: { row: number, column: number }): void {
    console.log('dragStart', { dragEvent, tile, e: this.gridEditor });
    const thing = document.createElement('DIV');
    thing.innerHTML = '';
    thing.classList.add('tile');
    thing.style.backgroundColor = 'green';
    thing.style.gridColumn = `${tile.column}`;
    thing.style.transition = `.2s`;
    thing.style.gridRow = `${tile.row}`;
    this.gridEditor.nativeElement.appendChild(thing);
    this.activeTile = {
      element: thing,
      start: tile
    };
  }

  dragEnd(dragEvent: DragEvent, tile: DashboardTile): void {
    console.log('dragEnd', { dragEvent, tile });
  }

  dragEnter(dragEvent: DragEvent, tile: { row: number, column: number }): void {
    console.log('dragEnter', { dragEvent, tile });
    this.activeTile.element.style.gridColumn = `${Math.min(this.activeTile.start.column, tile.column + 1)}`;
    this.activeTile.element.style.gridRow = `${Math.min(this.activeTile.start.row, tile.row + 1)}`;
    this.activeTile.element.style.gridColumnEnd = `${Math.max(this.activeTile.start.column, tile.column + 1)}`;
    this.activeTile.element.style.gridRowEnd = `${Math.max(this.activeTile.start.row, tile.row + 1)}`;
  }

}
