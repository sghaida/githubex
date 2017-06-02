
var chai        = require('chai'),
    chaiHttp    = require('chai-http'),
    mongo       = require('mongoose'),
    config      = require('../config/config.json'),
    Account        = require('../models/user'),
    github      = require('../helpers/github'),
    passport    = require('passport'),
    server      = require('../app');


var should = chai.should(),
    expect = chai.expect;
chai.use(chaiHttp);

describe('Results', function() {

    this.timeout(15000);
    /* connect to mongo and create user*/
    before(function(done) {
        db = mongo.connect(config.mongo.URI);
        var account = new Account({
            username: 'sghaida123'
        });
        Account.register(account,"123456", function (err, user) {
            if(err) console.log(err);
            passport.authenticate('local');
        });

        account.save(function (error) {
            if (error) console.log('error' + error.message);
            else console.log('no error');
            done();
        });
    });

    it('find a user by username', function(done) {
        Account.findOne({ username: 'sghaida123' }, function(err, account) {
            account.username.should.eql('sghaida123');
            done();
        });
    });

    it('should success getting list of users Uris from GitHub *getUsers', function (done) {
        var res = github.getUsers('scala', function (err, result) {
            if(err) done(err)
            else {
                result.should.have.lengthOf(20);
                done();
            }
        });
    });

    it('should succeed in getting 20 users info from GitHub  *getUsersInfo', function(done) {
        var res = github.getUsersInfo('scala', function (err, result) {
            if(err) done(err)
            else {
                result.should.have.lengthOf(20);
                done();
            }
        });
    });
    
    it('should authenticate successfully on /login POST', function (done) {
        chai.request(server)
            .post('/auth/login')
            .send({username: 'sghaida123', password: '123456'})
            .end(function(err, res){
                if(err) done(err);
                else {
                    res.should.have.status(200);
                    expect(res.redirects.length).eql(2);
                    done();
                }
            });
    });

    /* delete user and disconnect from mongo*/
    after(function(done) {
        Account.remove({}, function() {
            done();
        });
        mongo.connection.close();
        done();
    });

});