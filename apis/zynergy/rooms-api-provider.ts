import { Express } from 'express';
import { Zynject, Zynjectable } from '../core';
import { FileDb } from '../core/storage/file-db';
import { DeviceProvider } from '../providers/device-provider';
import { ApiServiceProvider } from './api-service-provider';

@Zynjectable()
export class RoomsApiServiceProvider extends ApiServiceProvider {

    private _endpoint: string = '/rooms';

    constructor(@Zynject(DeviceProvider) private deviceProviders: DeviceProvider[], private fileDb: FileDb) {
        super();
    }

    register(app: Express) {
        app.get(`${this._endpoint}`, async (req, res) => {
            const rooms = this.fileDb.get('rooms');
            res.json(rooms)
        });

        app.post(`${this._endpoint}/:id`, async (req, res) => {
            const room = req.body;
            this.fileDb.store('rooms', room); 
            res.jsonp(room);
        });
    }
}