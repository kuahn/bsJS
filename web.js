/*
var bs = require('./bs/bsnode');
bs.ROUTER.route( 8001, '../node', '_.js' );
*/
var http = require("http");
http.createServer(function(request, response) {
response.writeHead(200, {"Content-Type": "text/html"});
response.write("Hello, World~!!");
response.end();
}).listen(8001);