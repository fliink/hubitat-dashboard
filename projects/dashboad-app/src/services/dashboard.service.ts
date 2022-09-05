import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { delay, map, mergeMap, share, tap } from 'rxjs/operators';
import { DeviceCapabilities, HubitatDevice } from 'projects/models/src/lib/maker-api/device.model';
import { Socket } from 'ngx-socket-io';
import { environment } from '../environments/environment';
import { Dashboard } from 'projects/models/src/lib/dashboard-api/dashboard';

@Injectable()
export class DashboardService {

    private apiHost = environment.apiUrl;

    private _dashboards: { [key: string]: Dashboard };
    private _dashboardArray: BehaviorSubject<Dashboard[]> = new BehaviorSubject(<Dashboard[]>[]);
    dashboards$: Observable<Dashboard[]> = this._dashboardArray.asObservable();

    constructor(private http: HttpClient, private socket: Socket) {
        this._dashboards = {};
    }

    save(data: any): Observable<any> {
        const saveUrl = `${this.apiHost}/dashboards`;
        return this.http.post(saveUrl, JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } }).pipe(tap(x=>{
            this._dashboards[x.id] = x;
        }));
    }

    load(): Observable<Dashboard[]> {
        const loadUrl = `${this.apiHost}/dashboards`;
        return this.http.get<Dashboard[]>(loadUrl).pipe(tap(x=>{
            this._dashboards = x.reduce((a, b)=>{
                a[b.id] = b;
                return a;
            }, {});
            this._dashboardArray.next(Object.values(this._dashboards));
        }));
    }

}