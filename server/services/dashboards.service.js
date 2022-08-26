const db = require("../db");


function register(app){
    app.get('/dashboards', getMany);
    app.post('/dashboards', post);
}

function getMany(req, res){
    const dashboards = db.get('dashboards');
    if(dashboards){
        res.jsonp(dashboards);
    }else{
        res.status(404).send("Sorry can't find that!")
    }
}

function post(req, res){
    const dashboard = req.body;
    db.store('dashboards',dashboard);
    res.jsonp(dashboard);
}

exports.register = register;