import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { delay, map, mergeMap, share } from 'rxjs/operators';
import { DeviceCapabilities, HubitatDevice } from 'projects/models/src/lib/maker-api/device.model';
import { Socket } from 'ngx-socket-io';
import { environment } from '../environments/environment';

@Injectable()
export class MakerApiService {

    private apiHost = environment.apiUrl;
    private apiKey = '?access_token=bbfc30d1-f4cc-4ace-a5a0-20a492d0eaa1';

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
        //http://192.168.1.156/apps/api/3845/postURL/[URL]?access_token=YOUR_ACCESS_TOKEN
        const registerUrl = `http://192.168.1.2/apps/api/45/postURL/http%3A%2F%2F192.168.1.3%3A8080%2FdeviceUpdates${this.apiKey}`;
        this.http.get(registerUrl).subscribe();
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

    sendCommand(deviceId: string, commands: { [key: string]: any } | string) : Observable<HubitatDevice> | Observable<HubitatDevice[]> {
        if (typeof commands === 'string') {
            return this.http.get<HubitatDevice>(`${this.apiHost}/sendCommand?deviceId=${deviceId}&command=${commands}`);
        }
        else {
            const requests = Object.keys(commands).map(command => {
                const url: string = `${this.apiHost}/sendCommand?deviceId=${deviceId}&command=${command}&value=${commands[command]}`;
                return this.http.get<HubitatDevice>(`${url}`);
            });
            return forkJoin(requests);
        }


    }
}