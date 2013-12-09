require('./bs/bsnode').$route( require('./noderoot/lab/route').route );
require('./bs/bsnode').$route( require('./noderoot/showcase/route').route );
require('./bs/bsnode').$route( require('./noderoot/test/route').route );
/*
var http = require("http");
http.createServer(function(request, response) {
response.writeHead(200, {"Content-Type": "text/html"});
response.write("Hello, World~!!");
response.end();
}).listen(8001);
*/