var config = require('./config'),
    mongoose = require('mongoose');
module.exports = function() {
    var db = mongoose.connect(config.db);

    require('../app/models/user.mod.js');
    require('../app/models/article.mod.js');


    return db;
};