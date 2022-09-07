const db = require("../db");


function register(app){
    app.get('/rooms', getMany);
    app.post('/rooms', post);
}

function getMany(req, res){
    const rooms = db.get('rooms');
    if(rooms){
        res.jsonp(rooms);
    }else{
        res.status(404).send("Sorry can't find that!");
    }
}

function post(req, res){
    const room = req.body;
    db.store('rooms',room); 
    res.jsonp(room);
}

exports.register = register;