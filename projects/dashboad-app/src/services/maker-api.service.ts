import { state } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Device } from 'apis/models/device';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { map, skipWhile, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable()
export class MakerApiService {

    private apiHost = environment.apiUrl;

    private initialized = false;
    private _devices: { [key: string]: Device };
    private _deviceMap: BehaviorSubject<{ [key: string]: Device }> = new BehaviorSubject(<{ [key: string]: Device }>null);

    deviceMap$: Observable<{ [key: string]: Device }> = this._deviceMap.asObservable().pipe(skipWhile(x => !x));
    devices$: Observable<Device[]> = this.deviceMap$.pipe(map(x=>Object.values(x).sort(((a, b) => a.name.localeCompare(b.name)))));

    constructor(private http: HttpClient, private socket: Socket) {
        this._devices = {};
        this.socket.on('message', (x: { deviceId: string, value: any, name: string }) => {
            this._devices[x.deviceId].attributes[x.name] = x.value;
            this._deviceMap.next(this._devices);
        });

        this.init();
    }

    init() {
        // const registerUrl = `${this.apiHost}/register`;
        // this.http.get(registerUrl).subscribe();
    }

    save(data: any): void {
        const saveUrl = `${this.apiHost}/save`;
        this.http.post(saveUrl, JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } }).subscribe(x => {
            console.log(x);
        });
    }

    load(): Observable<{ dashboard: any, tiles: any[] }> {
        const loadUrl = `${this.apiHost}/load`;
        return this.http.get<{ dashboard: any, tiles: any[] }>(loadUrl);
    }

    loadDevices(): void {
        if (this.initialized) { return; }
        this.http.get<Device[]>(`${this.apiHost}/devices`).pipe(tap(x => this.initialized = true)).subscribe((result => {
            this._devices = result.reduce((a: { [key: string]: Device }, b) => {
                a[b.id] = b;
                return a;
            }, {});

            this._deviceMap.next(this._devices);
        }));
    }

    sendCommand(deviceId: string, commands: { [key: string]: any } | string, emitOnSuccess?: {value: string | number, attribute: string} | {attribute: string, value: string | number} []): Observable<Device | Device[]> {
        var emitString = '';
        if(Array.isArray(emitOnSuccess)){
            emitOnSuccess.forEach(x=>{
                emitString +=`&emit=${x.attribute}|${x.value}`;
            });
        }else{
            emitString +=`&emit=${emitOnSuccess.attribute}|${emitOnSuccess.value}`;
        }

        if (typeof commands === 'string') {
            return this.http.get<Device>(`${this.apiHost}/sendCommand?deviceId=${deviceId}&command=${commands}${emitString}`);
        }
        else {
            const requests = Object.keys(commands).map(command => {
                const url: string = `${this.apiHost}/sendCommand?deviceId=${deviceId}&command=${command}&value=${commands[command]}${emitString}`;
                return this.http.get<Device>(`${url}`);
            });
            return forkJoin(requests);
        }

    }

    

    state(device: Partial<Device>) {
        return this.http.post<Device>(`${this.apiHost}/devices/${device.id}`, device);
    }
}