import * as fs from 'fs-extra';
import * as crypto from 'crypto';
import { Zynjectable } from '../zynject/zynject';

@Zynjectable()
export class FileDb {
    store2 = { tiles: [], dashboard: { id: 0, name: '', height: 8, width: 3 } };
    start() {
        fs.exists('./db.fb', x => {
            if (x) {
                fs.readFile('db.fb', 'utf8', (err, data) => {
                    this.store2 = data ? JSON.parse(data) : this.store2;
                });
            } else {
                fs.writeFile('db.fb', JSON.stringify(this.store2), x => { });
            }
        });
    }

    save(data: any) {
        fs.outputFile('db.fb', JSON.stringify(data), x => {
            this.store2 = data;
        });
    }

    store(path: string, data: any) {
        let ids = [];
        if (fs.existsSync(`data/${path}/index.json`)) {
            ids = JSON.parse(fs.readFileSync(`data/${path}/index.json`, 'utf-8'));
        }
        if (!data.id) {
            data.id = this.newId();
            ids.push(data.id);
        }
        fs.outputFileSync(`data/${path}/index.json`, JSON.stringify(ids));
    
        fs.outputFileSync(`data/${path}/${data.id}.json`, JSON.stringify(data));
    }

    get(path: string) {
        if (!fs.existsSync(`data/${path}/index.json`)) {
            return;
        }
        //TODO: null check
        const x = JSON.parse(fs.readFileSync(`data/${path}/index.json`, 'utf-8'));
        let records = [];
        for (var id in x) {
            records.push(JSON.parse(fs.readFileSync(`data/${path}/${x[id]}.json`, 'utf-8')));
        }
        return records;
    }

    newId() {
        return crypto.randomUUID();
    }
}