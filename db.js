var mongojs = require('mongojs');

var databaseUrl = 'mongodb://test:1234@localhost:27017/reg-schedule';
var collections = ['test', '1234'];

var connect = mongojs(databaseUrl, collections);

module.exports = {
    connect: connect
};