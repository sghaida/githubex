
var config = require('./config.json');

module.exports = {
    getDbUri : function () {
        return config.mongo.URI;
    },
    getSecret : function() {
        return config.secret;
    }
}
