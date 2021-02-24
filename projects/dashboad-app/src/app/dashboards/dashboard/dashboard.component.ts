import { Component, ComponentFactoryResolver, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MakerApiService } from 'projects/dashboad-app/src/services/maker-api.service';
import { Dashboard, DashboardTile } from 'projects/models/src/lib/dashboard-api/dashboard';
import { HubitatDevice } from 'projects/models/src/lib/maker-api/device.model';
import { Observable } from 'rxjs';
import { skipWhile, take } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  @ViewChild('grideditor') gridEditor!: ElementRef<HTMLDivElement>;
  @ViewChild('editorcontainer', { read: ViewContainerRef }) editorcontainer!: ViewContainerRef;

  dashboard: Dashboard = { id: 0, name: '', height: 8, width: 8 };
  gridCells: { row: number, column: number }[] = [];
  activeTemplateTile?: { element: HTMLElement, start: { row: number, column: number }, end?: { row: number, column: number } };

  editorActive: boolean = false;
  devices$: Observable<HubitatDevice[]>;
  selectedDevice: HubitatDevice;
  selectedCapability: string = '';
  deviceListVisible: boolean = false;
  capabilityListVisible: boolean = false;

  tiles: DashboardTile[] = [];
  activeTile: DashboardTile = undefined;
  private rowColumn: string = '';

  editorMode: boolean = false;

  constructor(private makerService: MakerApiService, private componentFactoryResolver: ComponentFactoryResolver, private vc: ViewContainerRef) {
    this.devices$ = this.makerService.devices$;
    this.makerService.loadDevices();
    this.devices$.pipe(skipWhile(x => !x.length), take(1)).subscribe(devices => {
      const savedDashboardString = localStorage.getItem('dashboard');
      if (savedDashboardString) {
        const savedDashboard = JSON.parse(savedDashboardString) as DashboardTile[];
        savedDashboard.forEach(t => {
          t.device = devices.find(d => d.id === t.device.id);
          this.tiles.push(t);
        });
      }
    });
  }

  toggleEdit() {
    this.editorMode = !this.editorMode;
  }

  save() {
    localStorage.setItem('dashboard', JSON.stringify(this.tiles));
  }

  ngOnInit(): void {
    for (let i = 1; i <= this.dashboard.height; i++) {
      for (let j = 1; j <= this.dashboard.width; j++) {
        this.gridCells.push({
          row: i,
          column: j
        });
      }
    }
  }

  dragOrigin: MouseEvent | TouchEvent;
  originTile: { row: number, column: number };
  isDragging: boolean = false;
  mouseDown(mouseEvent: MouseEvent | TouchEvent, tile: { row: number, column: number }): void {
    this.dragOrigin = mouseEvent;
    this.originTile = tile;
  }

  mouseEnter(mouseEvent: MouseEvent | TouchEvent, tile: { row: number, column: number }): void {
    if (!this.isDragging) { return; }
    if(mouseEvent instanceof TouchEvent){
      const element = document.elementFromPoint(mouseEvent.touches[0].clientX, mouseEvent.touches[0].clientY);
      const row = Number(element.getAttribute('data-tile-row'));
      const column = Number(element.getAttribute('data-tile-column'));
      const rowColumn = `${row}:${column}`;
      if(this.rowColumn == rowColumn){
        return;
      }
      tile = {
        row,
        column
      }
    }
    this.dragEnter(mouseEvent, tile);
  }

  mouseUp(mouseEvent: MouseEvent | TouchEvent, tile: { row: number, column: number }): void {
    if (this.isDragging) {
      this.dragEnd(mouseEvent, tile);
    }
    this.isDragging = false;
    this.dragOrigin = undefined;
    this.originTile = undefined;
    this.rowColumn = undefined;
  }
  private getPosition(mouseEvent: MouseEvent | TouchEvent){
    let x: number, y: number;
    if(mouseEvent instanceof MouseEvent){
      x = mouseEvent.clientX;
      y = mouseEvent.clientY;
    }else if(mouseEvent instanceof TouchEvent){
      x = mouseEvent.touches[0].clientX;
      y = mouseEvent.touches[0].clientY;
    }
    return {x, y};
  }

  mouseMove(mouseEvent: MouseEvent | TouchEvent) {
    if (!this.dragOrigin || this.isDragging) {
      return;
    }
    
    const position = this.getPosition(mouseEvent);
    const originPosition = this.getPosition(this.dragOrigin);

    console.log(position);
    if (Math.abs(position.y - originPosition.y) > 15 || Math.abs(position.x - originPosition.x) > 15) {
      this.isDragging = true;
      this.dragStart(this.dragOrigin, this.originTile);
    }
  }

  dragStart(dragEvent: MouseEvent | TouchEvent, tile: { row: number, column: number }): void {
    const thing = document.createElement('DIV');
    thing.innerHTML = '';
    thing.classList.add('tile');
    thing.style.backgroundColor = 'lightgrey';
    thing.style.gridColumn = `${tile.column}`;
    thing.style.gridRow = `${tile.row}`;
    thing.style.margin = '4px'
    this.gridEditor.nativeElement.prepend(thing);
    this.activeTemplateTile = {
      element: thing,
      start: tile
    };
  }

  dragEnd(dragEvent: MouseEvent | TouchEvent, tile: { row: number, column: number }): void {
    const gridColumn = Math.min(this.activeTemplateTile!.start.column, this.activeTemplateTile!.end!.column);
    const gridRow = Math.min(this.activeTemplateTile!.start.row, this.activeTemplateTile!.end!.row);
    const gridColumnEnd = Math.max(this.activeTemplateTile!.start.column + 1, this.activeTemplateTile!.end!.column + 1);
    const gridRowEnd = Math.max(this.activeTemplateTile!.start.row + 1, this.activeTemplateTile!.end!.row + 1);


    this.activeTile = {
      id: 0,
      device: undefined,
      name: 'New Tile',
      type: 'light',
      position: {
        bottom: gridRowEnd,
        left: gridColumn,
        right: gridColumnEnd,
        top: gridRow
      }
    };

    this.tiles.push(this.activeTile);
    this.editorActive = true;
  }

  dragEnter(dragEvent: MouseEvent | TouchEvent, tile: { row: number, column: number }): void {
    console.log('dragEnter', tile)
    this.activeTemplateTile.element.style.gridColumn = `${Math.min(this.activeTemplateTile.start.column, tile.column)}`;
    this.activeTemplateTile.element.style.gridRow = `${Math.min(this.activeTemplateTile.start.row, tile.row)}`;
    this.activeTemplateTile.element.style.gridColumnEnd = `${Math.max(this.activeTemplateTile.start.column + 1, tile.column + 1)}`;
    this.activeTemplateTile.element.style.gridRowEnd = `${Math.max(this.activeTemplateTile.start.row + 1, tile.row + 1)}`;
    this.activeTemplateTile.end = tile;
  }

  selectDevice(device: HubitatDevice): void {
    this.selectedDevice = device;
    this.activeTile.device = this.selectedDevice;
  }

  selectCapability(capability: string): void {
    this.selectedCapability = capability;
  }

  setDeviceListVisible(value: boolean): void {
    this.deviceListVisible = value;
  }

  setCapabilityListVisible(value: boolean): void {
    this.capabilityListVisible = value;
  }

}
