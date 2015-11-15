//公共模块
var config = require('./config'),
    express = require('express'),
    morgan = require('morgan'),
    compress = require('compression'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require('express-session');

module.exports = function(opt){
    var app = express();
    //var server = http.createServer(app);
    console.log(process.env.NODE_ENV);
    if (process.env.NODE_ENV === 'development') {
        //日志功能
        app.use(morgan('dev'));
    } else if (process.env.NODE_ENV === 'production') {
        //压缩功能
        app.use(compress());
    }

    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(methodOverride());

    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret
    }));


    app.set('views', './public/views');
    app.set('view engine', 'ejs');

    require('../app/routes/route.js')(app);
    require('../app/routes/user.r.js')(app);




    app.use(express.static('./public'));
    return app;
};