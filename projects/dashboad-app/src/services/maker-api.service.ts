import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, mergeMap, share } from 'rxjs/operators';
import { HubitatDevice } from 'projects/models/src/lib/maker-api/device.model';

@Injectable()
export class MakerApiService {

    private apiHost = 'http://192.168.1.2/apps/api/45/devices';
    private apiKey = '?access_token=bbfc30d1-f4cc-4ace-a5a0-20a492d0eaa1';

    private _devices: { [key: string]: HubitatDevice };
    private _deviceArray: BehaviorSubject<HubitatDevice[]> = new BehaviorSubject(<HubitatDevice[]>[]);
    devices$: Observable<HubitatDevice[]> = this._deviceArray.asObservable();
    constructor(private http: HttpClient) {
        this._devices = {};
    }

    loadDevices(): void {
        this.http.get<HubitatDevice[]>(`${this.apiHost}/all${this.apiKey}`).subscribe((result => {
            result.forEach(x => {
                x.attributes = x.attributes || {};
                if (x.attributes.lightEffects) {
                    x.attributes.lightEffects = JSON.parse(<string>x.attributes.lightEffects);
                }
            });

            this._devices = result.reduce((a: { [key: string]: HubitatDevice }, b) => {
                a[b.id] = b;
                return a;
            }, {});

            console.log('_devices', this._devices);

            this._deviceArray.next(Object.values(this._devices));
        }));
    }

    sendCommand(deviceId: string, command: string, value?: string | number) {
        let url = `${this.apiHost}/${deviceId}/${command}`;
        if (value) {
            url = `${url}/${value}`;
        }
        return this.http.get<HubitatDevice>(`${url}${this.apiKey}`).pipe(map(x => {
            console.log('beforeAssign', x);
            x.attributes = (<{name: string}[]>x.attributes).reduce((a, b) => {
                a[b.name] = b.currentValue;
                return a;
            }, {}) || {};
            if (x.attributes.lightEffects) {
                x.attributes.lightEffects = JSON.parse(<string>x.attributes.lightEffects);
            }
            Object.assign(this._devices[x.id], x);

            console.log('assignedDevice', this._devices[x.id]);
            this._deviceArray.next(Object.values(this._devices));
            return x;
        }));
    }
}