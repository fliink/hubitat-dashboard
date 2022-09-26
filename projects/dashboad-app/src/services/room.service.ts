import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable, of, ReplaySubject } from 'rxjs';
import { delay, map, mergeMap, share, tap, take } from 'rxjs/operators';
import { Socket } from 'ngx-socket-io';
import { environment } from '../environments/environment';
import { Dashboard } from 'projects/models/src/lib/dashboard-api/dashboard';
import { Room } from 'projects/models/src/lib/dashboard-api/room';

@Injectable()
export class RoomService {

    private apiHost = environment.apiUrl;

    private _roomsSubject: ReplaySubject<Room[]> = new ReplaySubject();
    rooms$: Observable<Room[]> = this._roomsSubject.asObservable();

    constructor(private http: HttpClient, private socket: Socket) {
    }


    save(data: Room): void {
        let saveUrl = `${this.apiHost}/rooms`;
        if(data.id){
            saveUrl = `${saveUrl}/${data.id}`;
        }
        this.http.post(saveUrl, JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } }).subscribe(x => {
            console.log(x);
        });
    }

    load(): void {
        const loadUrl = `${this.apiHost}/rooms`;
        this.http.get<Room[]>(loadUrl).pipe(take(1)).subscribe(x => {
            this._roomsSubject.next(x);
        });
    }

}