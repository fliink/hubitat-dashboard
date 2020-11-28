import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { delay, map, mergeMap, share } from 'rxjs/operators';
import { HubitatDevice } from 'projects/models/src/lib/maker-api/device.model';
import { Socket } from 'ngx-socket-io';

@Injectable()
export class MakerApiService {

    private apiHost = 'http://localhost:8080';
    private apiKey = '?access_token=bbfc30d1-f4cc-4ace-a5a0-20a492d0eaa1';

    private _devices: { [key: string]: HubitatDevice };
    private _deviceArray: BehaviorSubject<HubitatDevice[]> = new BehaviorSubject(<HubitatDevice[]>[]);
    devices$: Observable<HubitatDevice[]> = this._deviceArray.asObservable();
    constructor(private http: HttpClient, private socket: Socket) {
        this._devices = {};
     
    }

    init(){
        //http://192.168.1.156/apps/api/3845/postURL/[URL]?access_token=YOUR_ACCESS_TOKEN
        const registerUrl = `http://192.168.1.2/apps/api/45/postURL/http%3A%2F%2Flocalhost%3A8080%2FdeviceUpdates${this.apiKey}`;
        this.http.get(registerUrl).subscribe();
    }

    loadDevices(): void {
        this.http.get<HubitatDevice[]>(`${this.apiHost}/devices`).subscribe((result => {
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

    sendCommand(deviceId: string, commands: { [key: string]: any }) {
        const requests = Object.keys(commands).map(command => {
            let url = `${this.apiHost}/${deviceId}/${command}`;
            if (commands[command]) {
                url = `${url}/${commands[command]}`;
            }
            return this.http.get<HubitatDevice>(`${url}${this.apiKey}`)
        });

        return forkJoin(requests).pipe(delay(500), mergeMap(result=>{
            let url = `${this.apiHost}/${deviceId}/refresh`;
            return this.http.get<HubitatDevice>(`${url}${this.apiKey}`).pipe(map(refreshResult=>{
                refreshResult.attributes = (<{ name: string }[]>refreshResult.attributes).reduce((a, b) => {
                    a[b.name] = b.currentValue;
                    return a;
                }, {}) || {};
                if (refreshResult.attributes.lightEffects) {
                    refreshResult.attributes.lightEffects = JSON.parse(<string>refreshResult.attributes.lightEffects);
                }

                Object.assign(this._devices[refreshResult.id], refreshResult);
                this._deviceArray.next(Object.values(this._devices));
                return refreshResult;
            }));
        }));
    }
}