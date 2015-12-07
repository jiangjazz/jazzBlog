exports.index = function(req, res) {
    if (req.session.lastVisit) {
        console.log(req.session.lastVisit);
    }
    req.session.lastVisit = new Date();
    res.render('index', {
        title: '欢迎来到我的小窝',
        user: JSON.stringify(req.user),
        userFullName: req.user ? req.user.fullName : ''
    });
};


exports.aboutme = function(req, res) {
    if (req.session.lastVisit) {
        console.log(req.session.lastVisit);
    }
    req.session.lastVisit = new Date();
    res.render('aboutme', {
        title: '一些事',
        user: JSON.stringify(req.user),
        userFullName: req.user ? req.user.fullName : ''
    });
};