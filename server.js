process.env.NODE_ENV =  process.env.NODE_ENV || 'development';

//公共模块
var mongoose= require('./config/mongoose'),
    express = require('./config/express'),
    passport = require('./config/passport');

//私有
var db = mongoose(),
    app = express(db),
    passport = passport();

//参数设置
var //host = '127.0.0.1',
    listen = 8080;

app.listen(listen);
module.exports = app;

console.log('success');