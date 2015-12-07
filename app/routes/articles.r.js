var users = require('../../app/controllers/user.ctr.js'),
    articles = require('../../app/controllers/articles.ctr.js');
module.exports = function(app) {
    app.route('/api/articles')
        .get(articles.list)
        .post(users.requiresLogin, articles.create);
    app.route('/api/articles/:articleId')
        .get(articles.read)
        .put(users.requiresLogin, articles.hasAuthorization, articles.update)
        .delete(users.requiresLogin, articles.hasAuthorization, articles.delete);
    app.param('articleId', articles.articleByID);
};


/*var users = require('../../app/controllers/user.ctr'),
    articles = require('../../app/controllers/articles.ctr');
module.exports = function(app) {
    app.route('/api/articles')
        .get(articles.list)
        .post(users.requiresLogin, articles.create);
    app.route('/api/articles/:articleId')
        .get(articles.read)
        .put(users.requiresLogin, articles.hasAuthorization, articles.update)
        .delete(users.requiresLogin, articles.hasAuthorization, articles.delete);
    app.param('articleId', articles.articleByID);
};*/