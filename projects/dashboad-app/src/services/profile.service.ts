import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { delay, map, mergeMap, share, tap, take } from 'rxjs/operators';
import { DeviceCapabilities, HubitatDevice } from 'projects/models/src/lib/maker-api/device.model';
import { Socket } from 'ngx-socket-io';
import { environment } from '../environments/environment';
import { Dashboard } from 'projects/models/src/lib/dashboard-api/dashboard';

@Injectable()
export class ProfileService {

    private apiHost = environment.apiUrl;

    private _profile: { id: string, firstName: string } = { id: '', firstName: 'User' };
    private _profileSubject: BehaviorSubject<{ id: string, firstName: string }> = new BehaviorSubject(this._profile);
    profile$: Observable<{ id: string, firstName: string }> = this._profileSubject.asObservable();

    constructor(private http: HttpClient, private socket: Socket) {
    }


    save(data: any): void {
        const saveUrl = `${this.apiHost}/profile`;
        this.http.post(saveUrl, JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } }).subscribe(x => {
            console.log(x);
        });
    }

    load(): void {
        const loadUrl = `${this.apiHost}/profile`;
        this.http.get<{ id: string, firstName: string }>(loadUrl).pipe(take(1)).subscribe(x => {
            this._profile = x;
            this._profileSubject.next(this._profile);
        });
    }

}