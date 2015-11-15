var users = require('../../app/controllers/user.ctr');

module.exports = function(app){
    app.route('/users').post(users.create);
};
