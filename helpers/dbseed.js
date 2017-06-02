
var mongo       = require('mongoose'),
    passport    = require('passport'),
    Account     = require('../models/user');

var account = new Account({
    username: 'test'
});

function createUser() {
    Account.remove({}, function (err) {
        if(err) console.log(err)
        else {
            Account.register(account,"test", function (err, user) {
                if(err) console.log(err);
                console.log('user created');
            });

            account.save(function (error) {
                if (error) console.log('error' + error.message);
                else console.log('User has been saved');
            });
        }
    });
}

module.exports = createUser;