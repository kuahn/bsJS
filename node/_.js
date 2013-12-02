var bs = require( '../bs/bsnode.js' );
exports.header = function(){
	return {'Content-Type':'text/html'};
};
exports.response = function(){
	return bs.$trim( 'test')+bs.$ex(3,'~',10);
};