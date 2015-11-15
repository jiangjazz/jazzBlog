process.env.NODE_ENV =  process.env.NODE_ENV || 'development';

//公共模块
var mongoose= require('./config/mongoose'),
    express = require('./config/express');

//私有
var db = mongoose(),
    server = express(123);

//参数设置
var host = '127.0.0.1',
    listen = 8080;


console.log('success');
server.listen(listen, host);

module.exports = server;
