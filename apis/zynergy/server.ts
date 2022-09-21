import { Zynject, Zynjectable } from "../core";
import express from 'express';
import { Express } from 'express';
import { DeviceProvider } from "../providers/device-provider";
import { ZynjectContainer } from "../core/zynject/container";
import { DeviceQuery } from "./device-query";
import { XYtoRGB } from "../core/color/color-converter";

@Zynjectable()
export class ZynergyServer {
    app: Express;
    constructor(@Zynject(DeviceProvider) private deviceProviders: DeviceProvider[]) {
        const rgb = XYtoRGB({
            x:  0.4584,
            y: 0.41
        }, 'LCT014');

        console.log(rgb);
    }

    start(port: number){
        this.app = express();
        this.configure(this.app);
        this.app.listen(port);
    }

    private configure(app: Express){
        app.get('/devices', async (req, res) => {
            const query = this.getDeviceQuery(req.query);
            return Promise.all(this.deviceProviders.map(x=>x.devices())).then(x=>{
                const devices = x.reduce((a, b)=>{
                    return a.concat(b);
                }, []).filter(d=>{
                    return !query.types || Object.entries(d.capabilities).find((entry)=>{
                        return query.types?.includes(entry[0]) && entry[1];
                    });
                });
                return res.json(devices);
            })
          });
    }

    private getDeviceQuery(params: {[key: string]: any} = {}): DeviceQuery {
        const query: DeviceQuery = {};
        query.types = params['capabilities']?.split(',');
        return query;
    }
}


