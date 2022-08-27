const fs = require('fs-extra');
let store2 = { tiles: [], dashboard: { id: 0, name: '', height: 8, width: 3 } };
const crypto = require('crypto');

function start() {
    fs.exists('./db.fb', x => {
        if (x) {
            fs.readFile('db.fb', 'utf8', (err, data) => {
                store2 = JSON.parse(data || store2);
            });
        } else {
            fs.writeFile('db.fb', JSON.stringify(store2), x => { });
        }
    });
}

function save(data) {
    fs.outputFile('db.fb', JSON.stringify(data), x => {
        store2 = data;
    });
}

function store(path, data) {
    let ids= [];
    if(fs.existsSync(`data/${path}/index.json`)){
        ids = JSON.parse(fs.readFileSync(`data/${path}/index.json`));
    }
    if (!data.id) {
        data.id = newId();
        ids.push(data.id);
    }
    fs.outputFileSync(`data/${path}/index.json`, JSON.stringify(ids));

    fs.outputFileSync(`data/${path}/${data.id}.json`, JSON.stringify(data));
}

function get(path) {
    if(!fs.existsSync(`data/${path}/index.json`)){
        return;
    }
    //TODO: null check
    const x = JSON.parse(fs.readFileSync(`data/${path}/index.json`));
    let records = [];
    for(var id in x){
        records.push(JSON.parse(fs.readFileSync(`data/${path}/${x[id]}.json`)));
    }
    return records;
}

function newId() {
    return crypto.randomUUID();
}


exports.start = start;
exports.save = save;
exports.store = store;
exports.get = get;
exports.newId = newId;