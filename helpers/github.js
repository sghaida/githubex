var express         = require('express'),
    router          = express.Router(),
    unirest         = require('unirest'),
    async           = require('async'),
    http            = require('http')
    config          = require('../config/config.json');


/* get all users api links based on the programing language filter */
function getUsers(language, callback) {
    var url = config.github.searchUri.replace('__language__', language);

    var req = unirest.get(url).header(
        {'Content-Type': 'application/json;', 'User-Agent': 'Fiddler'}
    ).end(function (response) {
        var results = [],
            users = response.body.items;

        users.forEach(function (user) {
            results.push({
                userUri: user.url
            })
        });
        callback(null,results);
    })
}

/* get details for every user */
function getDetails(users, callback) {
    var results = [];

    async.every(users, function (user, callback) {
        var req = unirest.get(user.userUri).header(
            {'Content-Type': 'application/json;', 'User-Agent': 'Fiddler'}
        ).end(function (response) {
            results.push({
                login: response.body.login || '',
                name: response.body.name || '',
                avatar: response.body.avatar_url || '',
                followers: response.body.followers || ''
            });
            callback(null, results);
        });
    }, function (err) {
        if(err) {
            //console.log(err);
            callback(err,[]);
        } else {
            callback(null, results);
        }
    });
}

getUsersInfo = function (language, cb) {

    async.waterfall([
        async.apply(getUsers,language),
        getDetails
    ], function(err, res) {
        if (err) {
            //console.log(err);
            cb(err, []);
        }  else {
            cb(null,res);
        }
    });

}

module.exports =  {
    getUsersInfo: getUsersInfo,
    getUsers:getUsers,
    getDetails:getDetails
}