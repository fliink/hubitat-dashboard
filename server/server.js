const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const { networkInterfaces } = require('os');
const db = require('./db');
const dashboards = require("./services/dashboards.service");
const profile = require("./services/users.service");
const rooms = require("./services/rooms.service");


const app = express();

const apiHost = 'http://192.168.1.99/apps/api/45';
const apiKey = '?access_token=bbfc30d1-f4cc-4ace-a5a0-20a492d0eaa1';
let devices = [];


app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

app.get("/register", (req, res) => {
  const nets = networkInterfaces();
  let results;

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
      if (net.family === familyV4Value && !net.internal) {
        results = encodeURIComponent(`http://${net.address}:8080/deviceUpdates`);
      }
    }
  }
  const uri = `${apiHost}/postURL/${results}${apiKey}`
  request({ uri }, (error, response, body) => {
    res.jsonp({ result: uri });
  });
});

app.post("/deviceUpdates", (req, res) => {
  const d = req.body.content;
  log(`Device updated - ${d.displayName} ${d.name} ${d.value}`);
  io.emit('message', req.body.content);
});


function corsStuff(req, res, next) {
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', true);
  next();
}

function log(message) {
  console.log(`${new Date().toISOString()}: ${message}`);
}

app.use(corsStuff);


app.post('/save', (req, res) => {
  console.log(req.body);
  db.save(req.body);
  res.jsonp({ status: 'ok' });
});

app.get('/load', (req, res) => {
  res.jsonp(db.load());
});


app.get("/devices", (req, res) => {
  console.log('devices');
  const uri = `${apiHost}/devices/all${apiKey}`;
  request({ uri }, (error, response, body) => {
    const result = JSON.parse(body);
    devices = result;
    res.jsonp(devices);
  });
});

app.get("/sendCommand", (req, res) => {
  const deviceId = req.query['deviceId'];
  const command = req.query['command'];
  const value = req.query['value'];
  const emitAttribute = req.query['emitAttribute'];
  const emitValue = req.query['emitValue'];

  let uri = `${apiHost}/devices/${deviceId}/${command}`;
  if (value) {
    uri = `${uri}/${value}`
  }
  uri = `${uri}${apiKey}`;

  request({ uri }, (error, response, body) => {
    const result = JSON.parse(body);
    devices = result;
    if (emitAttribute && emitValue) {
      io.emit('message', {
        deviceId: result.id,
        name: emitAttribute,
        value: emitValue
      });
    }
    res.jsonp(devices);
  });
});

dashboards.register(app);
profile.register(app);
rooms.register(app);

const server = app.listen(8080, () => {
  log('Hubitat Express Server Started.');
  db.start();
});

var io = require('socket.io')(server, {
  allowEIO3: true,
  credentials: true,
  cors: {
    origins: ["http://192.168.1.55", "http://localhost:4200", "http://home.local/"],
    methods: ["GET", "POST"]
  }
});



