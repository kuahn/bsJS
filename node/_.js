var bs = require( '../bs/bsnode.js' );
exports.response = function(){
	return bs.$trim( 'test')+bs.$ex(3,'~',10);
};