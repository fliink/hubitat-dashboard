const db = require("../db");


function register(app){
    app.get('/profile', get);
    app.post('/profile', post);
}

function get(req, res){
    const profile = db.get('profile');
    if(profile && profile.length == 1){
        res.jsonp(profile[0]);
    }else{
        res.jsonp({id: '27', firstName: 'Adam'});
    }
}

function post(req, res){
    const profile = req.body;
    db.store('profile',profile); 
    res.jsonp(profile);
}

exports.register = register;