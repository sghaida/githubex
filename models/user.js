
var mongo = require('mongoose'),
    passportMongo = require('passport-local-mongoose')
Schema = mongo.Schema;

var userSchema = new Schema({
    username: String,
    password: String
});

userSchema.plugin(passportMongo);

var User = mongo.model('User', userSchema );

module.exports = User;