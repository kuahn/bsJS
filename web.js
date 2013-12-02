/*
var bs = require('./bs/bsnode.js');
bs.ROUTER.route( 8080, '../node', '_.js' );
*/

var server = require('http').createServer();
server.on('request', function router( $rq, $rp ){
	$rp.writeHead( 200, {'Content-Type':'text/html'} );
	$rp.end( "aaaaaaaaaaa" );
} );