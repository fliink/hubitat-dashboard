const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const request = require("request");
const MongoClient = require('mongodb').MongoClient


const app = express();
var corsOptions = {
  origin: 'http://192.168.1.103',
  credentials: true
};






const apiHost = 'http://192.168.1.2/apps/api/45';
const apiKey = '?access_token=bbfc30d1-f4cc-4ace-a5a0-20a492d0eaa1';
let devices = [];


app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

app.post("/deviceUpdates", (req, res) => {
  // console.log({ body: req.body.content });
  io.emit('message', req.body.content);
});


function corsStuff(req, res, next) {
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', true);
  next();
}

app.use(corsStuff);



app.get("/devices", (req, res) => {
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

  let uri = `${apiHost}/devices/${deviceId}/${command}`;
  if(value){
    uri = `${uri}/${value}`
  }
  uri = `${uri}${apiKey}`;
  console.log(uri);
  request({ uri }, (error, response, body) => {
    console.error(body);
    const result = JSON.parse(body);
    devices = result;
    res.jsonp(devices);
  });
});

const server = app.listen(8080);

var io = require('socket.io')(server, {
  origins: ['http://192.168.1.103'],
  cors: {
    origin: 'http://192.168.1.103',
    credentials: true
  }
});


