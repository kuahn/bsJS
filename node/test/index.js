exports.bs = function( bs ){
	bs.$response(
		'<div>config : ', bs.$data( 'config' ), '</div>',
		'<div>subConfig : ', bs.$data( 'subConfig' ), '</div>'
	);
};