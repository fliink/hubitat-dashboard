const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const request = require("request");
const MongoClient = require('mongodb').MongoClient


const app = express();
var corsOptions = {
  origin: 'http://localhost:4200',
  credentials: true
};






const apiHost = 'http://192.168.1.2/apps/api/45';
const apiKey = '?access_token=bbfc30d1-f4cc-4ace-a5a0-20a492d0eaa1';
let devices = [];


// parse requests of content-type - application/json

// parse requests of content-type - application/x-www-form-urlencoded

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

app.post("/deviceUpdates", (req, res) => {
  console.log({ body: req.body.content });
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

const server = app.listen(8080);

var io = require('socket.io')(server, {
  origins: ['http://localhost:4200'],
  cors: {
    origin: 'http://localhost:4200',
    credentials: true
  }
});


