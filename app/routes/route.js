module.exports = function(app){
    var index = require('../controllers/handle');
    app.get('/', index.index);
    app.get('/aboutme', index.aboutme);
    //app.get('/signup', index.signup);
};