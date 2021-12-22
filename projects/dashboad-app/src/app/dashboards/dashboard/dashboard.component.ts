import { Component, ComponentFactoryResolver, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MakerApiService } from 'projects/dashboad-app/src/services/maker-api.service';
import { Dashboard, DashboardTile } from 'projects/models/src/lib/dashboard-api/dashboard';
import { HubitatDevice } from 'projects/models/src/lib/maker-api/device.model';
import { Observable } from 'rxjs';
import { skipWhile, take } from 'rxjs/operators';
import { DragPosition } from '../../models/position';


export interface DashboardSaveState {
  tiles?: DashboardTile[];
  dashboard?: Dashboard;
}

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
  settings: boolean = false;

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
        const savedDashboard = JSON.parse(savedDashboardString) as DashboardSaveState;
        savedDashboard.tiles?.forEach(t => {
          t.device = devices.find(d => d.id === t.device.id);
          this.tiles.push(t);
        });

        this.dashboard = savedDashboard.dashboard;
      }
    });
  }

  toggleEdit() {
    this.editorMode = !this.editorMode;
  }

  save() {
    const saveState = {
      dashboard: this.dashboard,
      tiles: this.tiles
    }
    localStorage.setItem('dashboard', JSON.stringify(saveState));
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

  originTile: { row: number, column: number };


  dragStart(dragEvent: DragPosition, tile: { row: number, column: number }): void {
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

  dragEnd(dragEvent: DragPosition, tile: { row: number, column: number }): void {
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

  dragEnter(dragEvent: DragPosition, tile: { row: number, column: number }): void {
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

  activateTile(tile: DashboardTile) {
    if (this.activeTile === tile) {
      this.closePane();
    } else {
      console.log(tile);
      this.activeTile = tile;
      this.selectedDevice = tile.device;
    }
  }

  deleteTile(tile: DashboardTile) {
    const tileIndex = this.tiles.indexOf(tile);
    this.tiles.splice(tileIndex, 1);
    this.closePane();
  }

  closePane() {
    this.activeTile = undefined;
    this.selectedDevice = undefined;
    this.settings = false;
    this.save();
  }

  changeWidth(amount: number){
    this.dashboard.width += amount;
    this.gridCells = [];
    for (let i = 1; i <= this.dashboard.height; i++) {
      for (let j = 1; j <= this.dashboard.width; j++) {
        this.gridCells.push({
          row: i,
          column: j
        });
      }
    }
  }

  changeHeight(amount: number){
    this.dashboard.height += amount;
    this.gridCells = [];
    for (let i = 1; i <= this.dashboard.height; i++) {
      for (let j = 1; j <= this.dashboard.width; j++) {
        this.gridCells.push({
          row: i,
          column: j
        });
      }
    }
  }

}
