import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { delay, map, mergeMap, share, tap } from 'rxjs/operators';
import { DeviceCapabilities, HubitatDevice } from 'projects/models/src/lib/maker-api/device.model';
import { Socket } from 'ngx-socket-io';
import { environment } from '../environments/environment';
import { url } from 'inspector';

@Injectable()
export class MakerApiService {

    private apiHost = environment.apiUrl;

    private _devices: { [key: string]: HubitatDevice };
    private _deviceArray: BehaviorSubject<HubitatDevice[]> = new BehaviorSubject(<HubitatDevice[]>[]);
    devices$: Observable<HubitatDevice[]> = this._deviceArray.asObservable();
    constructor(private http: HttpClient, private socket: Socket) {
        this._devices = {};
        this.socket.on('message', (x: { deviceId: string, value: any, name: string }) => {
            this._devices[x.deviceId].attributes[x.name] = x.value;
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
        this.http.get<HubitatDevice[]>(`${this.apiHost}/devices`).subscribe((result => {
            result.forEach(x => {
                x.attributes = x.attributes || {};
                if (x.attributes.lightEffects) {
                    x.attributes.lightEffects = JSON.parse(<string>x.attributes.lightEffects);
                }
                x.capabilityLookup = x.capabilities.reduce((a: DeviceCapabilities, b) => {
                    a[b] = true;
                    return a;
                }, {});
            });

            this._devices = result.reduce((a: { [key: string]: HubitatDevice }, b) => {
                a[b.id] = b;
                return a;
            }, {});

            this._deviceArray.next(Object.values(this._devices));
        }));
    }

    sendCommand(deviceId: string, commands: { [key: string]: any } | string): Observable<HubitatDevice | HubitatDevice[]> {
        if (typeof commands === 'string') {
            return this.http.get<HubitatDevice>(`${this.apiHost}/sendCommand?deviceId=${deviceId}&command=${commands}`).pipe(tap((r: HubitatDevice) => {
                const device = r.attributes = r.attributes || {};
                if (r.attributes.lightEffects) {
                    r.attributes.lightEffects = JSON.parse(<string>r.attributes.lightEffects);
                }
                r.capabilityLookup = r.capabilities.reduce((a: DeviceCapabilities, b) => {
                    a[b] = true;
                    return a;
                }, {});
                this._devices[r.id] = r;
                this._deviceArray.next(Object.values(this._devices));
            }));
        }
        else {
            const requests = Object.keys(commands).map(command => {
                const url: string = `${this.apiHost}/sendCommand?deviceId=${deviceId}&command=${command}&value=${commands[command]}`;
                return this.http.get<HubitatDevice>(`${url}`).pipe(tap(r => {
                    console.log(r);
                }));
            });
            return forkJoin(requests);
        }


    }
}