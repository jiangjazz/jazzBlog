module.exports = function(app){
    var index = require('../controllers/handle');
    app.get('/', index.render);
};