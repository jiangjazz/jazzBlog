var users = require('../../app/controllers/user.ctr'),
   passport = require('passport');



module.exports = function(app) {
    app.route('/signup')
        .get(users.renderSignup)
        .post(users.signup);
    app.route('/signin')
        .get(users.renderSignin)
        .post(passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/signin',
            failureFlash: true
        }));
    app.get('/signout', users.signout);
};

/*module.exports = function(app) {
    app.route('/users').post(users.create);
};*/