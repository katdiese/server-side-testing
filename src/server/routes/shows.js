var express = require('express');
var router = express.Router();
var knex = require('../../../db/knex');

function Shows() {
    return knex('shows');
};

router.get('/shows', function(req, res, next) {
  Shows().select().then(function(data) {
    res.status(200).json(data);
  })
});

router.get('/shows/:id', function(req, res, next) {
  Shows().where('id', req.params.id).select().then(function(data) {
    res.status(200).json(data);
  })
})

module.exports = router;
