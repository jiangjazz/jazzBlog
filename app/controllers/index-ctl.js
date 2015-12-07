var fs = require('fs');


module.exports = {
    home: function(req, res){
        var page = fs.readFileSync('public/index.html');
        res.writeHead(200, {'content-Type': 'text/html'});
        res.write(page);
        res.end('home');
    },
    about: function(req, res){
        res.writeHead(200, {'content-Type': 'text/plain'});
        res.end('about');
    }
};