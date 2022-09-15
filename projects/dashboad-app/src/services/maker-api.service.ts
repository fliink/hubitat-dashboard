import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { delay, map, mergeMap, share, skipWhile, tap } from 'rxjs/operators';
import { DeviceCapabilities, HubitatDevice } from 'projects/models/src/lib/maker-api/device.model';
import { Socket } from 'ngx-socket-io';
import { environment } from '../environments/environment';
import { url } from 'inspector';
import { isArray } from 'util';

@Injectable()
export class MakerApiService {

    private apiHost = environment.apiUrl;

    private initialized = false;
    private _devices: { [key: string]: HubitatDevice };
    private _deviceArray: BehaviorSubject<HubitatDevice[]> = new BehaviorSubject(<HubitatDevice[]>[]);
    devices$: Observable<HubitatDevice[]> = this._deviceArray.asObservable().pipe(skipWhile(x => x.length == 0));
    constructor(private http: HttpClient, private socket: Socket) {
        this._devices = {};
        this.socket.on('message', (x: { deviceId: string, value: any, name: string }) => {
            this._devices[x.deviceId].attributes[x.name] = x.value;
            this._deviceArray.next(Object.values(this._devices));
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
        this.http.get<HubitatDevice[]>(`${this.apiHost}/devices`).pipe(tap(x => this.initialized = true)).subscribe((result => {
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

            this._deviceArray.next(Object.values(this._devices).sort(((a, b) => a.label.localeCompare(b.label))));
        }));
    }

    sendCommand(deviceId: string, commands: { [key: string]: any } | string, emitOnSuccess?: {value: string | number, attribute: string} | {attribute: string, value: string | number} []): Observable<HubitatDevice | HubitatDevice[]> {
        var emitString = '';
        if(Array.isArray(emitOnSuccess)){
            emitOnSuccess.forEach(x=>{
                emitString +=`&emit=${x.attribute}|${x.value}`;
            });
        }else{
            emitString +=`&emit=${emitOnSuccess.value}|${emitOnSuccess.attribute}`;
        }

        if (typeof commands === 'string') {
            return this.http.get<HubitatDevice>(`${this.apiHost}/sendCommand?deviceId=${deviceId}&command=${commands}${emitString}`);
        }
        else {
            const requests = Object.keys(commands).map(command => {
                const url: string = `${this.apiHost}/sendCommand?deviceId=${deviceId}&command=${command}&value=${commands[command]}${emitString}`;
                return this.http.get<HubitatDevice>(`${url}`);
            });
            return forkJoin(requests);
        }


    }
}