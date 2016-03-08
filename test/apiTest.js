var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../src/server/app');
var knex = require('../db/knex');

var should = chai.should();

chai.use(chaiHttp);

describe('API routes', function() {

    beforeEach(function(done) {
        knex.migrate.rollback().then(function() {
            knex.migrate.latest()
            .then(function() {
                return knex.seed.run().then(function() {
                    done()
                });
            });
        });
    });

    afterEach(function(done) {
        knex.migrate.rollback().then(function() {
            done();
        });
    });

    describe('Get all shows', function() {

        it('should get all shows', function(done) {
            chai.request(server)
            .get('/api/shows')
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.length.should.equal(4);
                console.log(res.body.map(function (el) {
                    return el.name;
                }));
                res.body[0].should.have.property('name');
                res.body[0].name.should.equal('Suits');
                res.body[0].should.have.property('channel');
                res.body[0].channel.should.equal('USA Network');
                res.body[0].should.have.property('genre');
                res.body[0].genre.should.equal('Drama');
                res.body[0].should.have.property('rating');
                res.body[0].rating.should.equal(3);
                res.body[0].should.have.property('explicit');
                res.body[0].explicit.should.equal(false);
                done();
            });
        });

    });
    describe('Get single show', function() {
        it('Should return one show by id', function(done) {
            chai.request(server)
            .get('/api/shows/2')
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.length.should.equal(1);
                res.body[0].should.have.property('name');
                res.body[0].name.should.equal('Game of Thrones');
                res.body[0].should.have.property('channel');
                res.body[0].channel.should.equal('HBO');
                res.body[0].should.have.property('genre');
                res.body[0].genre.should.equal('Fantasy');
                res.body[0].should.have.property('rating');
                res.body[0].rating.should.equal(5);
                res.body[0].should.have.property('explicit');
                res.body[0].explicit.should.equal(true);
                done();
            })
        })
    })
    describe('Add a single show', function() {
        it('should add a single show', function(done) {
            chai.request(server)
            .send({
                name: 'testing',
                channel: 'thing',
                genre: 'show',
                rating: 1,
                explicit: false
            })
            .post('/api/shows')
            //.end is like success
            .end(function(err, res) {

                chai.request(server)
                .get('/api/shows/' + response.body[0])
                .end(function(err, res) {
                    res.should.have.status(200)
                    res.body.should.by.json;
                    res.body.should.have.property('name');
                    res.body.name.should.equal('testing');
                    done()
                })

            });
        });
    })

});

