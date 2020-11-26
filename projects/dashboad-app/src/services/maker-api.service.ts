import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { HubitatDevice } from 'projects/models/src/lib/maker-api/device.model';

@Injectable()
export class MakerApiService {

    private apiHost = 'http://192.168.1.2/apps/api/45/devices';
    private apiKey = '?access_token=bbfc30d1-f4cc-4ace-a5a0-20a492d0eaa1';

    constructor(private http: HttpClient) {

    }

    getDevices(): Observable<HubitatDevice[]> {
        return this.http.get<HubitatDevice[]>(`${this.apiHost}/all${this.apiKey}`).pipe(map(result => {

            result.forEach(x => {
                x.attributes = x.attributes || {};
                if (x.attributes.lightEffects) {
                    x.attributes.lightEffects = JSON.parse(<string>x.attributes.lightEffects);
                }
            });

            return result;
        }), share());
    }

    sendCommand(deviceId: string, command: string, value: string | number) {
        let url = `${this.apiHost}/${deviceId}/${command}`;
        if(value){
            url = `${url}/${value}`;
        }
        return this.http.get<HubitatDevice[]>(`${url}${this.apiKey}`);
    }
}