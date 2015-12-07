//公共模块
var config = require('./config'),
    http = require('http'),
    socketio = require('socket.io'),
    express = require('express'),
    morgan = require('morgan'),
    compress = require('compression'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session),
    flash = require('connect-flash'),
    passport = require('passport');

module.exports = function(opt){
    var app = express(),
        server = http.createServer(app),
        io = socketio.listen(server);
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

    var mongoStore = new MongoStore({
        db: opt.connection.db
    });

    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret,
        store: mongoStore
    }));


    app.set('views', './public/views');
    app.set('view engine', 'ejs');


    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());


    require('../app/routes/route.js')(app);
    require('../app/routes/user.r.js')(app);
    require('../app/routes/articles.r.js')(app);



    app.use(express.static('./public'));
    require('./socketio')(server, io, mongoStore);
    return server;
};